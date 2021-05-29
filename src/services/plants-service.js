import plantModel from "../models/plants";
import { CustomError } from "../utils/custom-error.js";
import aws from "aws-sdk";

export const PlantsService = {
  /* Plant pagination */
  async getAllPlants(page) {
    try {
      let plants = await plantModel.paginate(
        {},
        {
          select: "createdAt _id commonName cientificName",
          page,
          populate: { path: "createdBy", select: "firstName lastName" },
        }
      );
      return plants;
    } catch (error) {
      throw error;
    }
  },

  /**
   *
   * @param {id from request} id
   * @returns
   */
  async deletePlant(id) {
    try {
      await plantModel.findByIdAndDelete(id);
      return "Plant deleted succesfully";
    } catch (error) {
      throw new CustomError(404, "Plant not found or already deleted");
    }
  },

  /**
   *
   * @param {plant DTO from request} plant
   * @param {Token User} user
   * @param {File from request} file
   * @returns
   */
  async createPlant(plant, user, file) {
    try {
      const data = await uploadPhoto(file);
      await new plantModel({
        ...plant,
        createdBy: user._id,
        imgLink: data.Location,
      }).save();
      return { message: "Plant Successfully Created" };
    } catch (error) {
      throw new CustomError(500, "Internal Server Error");
    }
  },

  async getPlantById(id) {
    try {
      const plant = await plantModel.findById(id);
      return plant;
    } catch (error) {
      throw new CustomError(401, "Plant not found");
    }
  },

  async updatePlantById(id, plant, user, file) {
    try {
      if (file) {
        const data = await updatePhoto(plant, imgLink, file);
      }
      await new plantModel({
        ...plant,
        createdBy: user._id,
        imgLink: data.Location,
      }).save();
      return { message: "Plant Successfully Created" };
    } catch (error) {
      throw new CustomError(500, "Internal Server Error");
    }
  },
};

/* Uploads Photo to AWS S3 */
const uploadPhoto = (file) => {
  const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  });
  const params = {
    Bucket: "agrotic-resources",
    Key: `plantsPictures/${Date.now() + file.originalname}`,
    Body: file.buffer,
  };
  return new Promise((resolve, reject) => {
    s3.upload(params, async (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const updatePhoto = (imgLink, file) => {
  const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  });
  const params = {
    Bucket: "agrotic-resources",
    Key: `plantsPictures/${imgLink}`,
    Body: file.buffer,
  };
  return new Promise((resolve, reject) => {
    s3.upload(params, async (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

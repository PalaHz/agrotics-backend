import plantModel from "../models/plants";
import { CustomError } from "../utils/custom-error.js";
import aws from "aws-sdk";

export const PlantsService = {
  /* Plant pagination */
  async getAllPlants(page, filters) {
    console.log(filters)
    try {
      let plants = await plantModel.paginate(
        filters,
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
    let data;
    try {
      if (file) {
        data = await uploadPhoto(file);
      }
      await new plantModel({
        ...plant,
        createdBy: user._id,
        imgLink: data ? data.Location : "",
      }).save();
      return { message: "Plant Successfully Created" };
    } catch (error) {
      console.log(error)
      throw new CustomError(500, "Internal Server Error");
    }
  },

  async getPlantById(id) {
    try {
      const plant = await plantModel
        .findById(id)
        .select("-createdAt -createdBy -__v");
      return plant;
    } catch (error) {
      throw new CustomError(401, "Plant not found");
    }
  },

  async updatePlantById(id, plant, file) {
    try {
      const doc = await plantModel.findOne({ _id: id });
      if (doc) {
        Object.entries(plant).forEach((item) => {
          doc[item[0]] = item[1];
        });
        if (file) {
          const s3Response = await uploadPhoto(file);
          doc.imgLink = s3Response.Location;
        }
        doc.save();
      } else {
        throw new CustomError(401, "Plant Nor found");
      }
      return { message: "Plant Successfully Updated" };
    } catch (error) {
      console.log(error);
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

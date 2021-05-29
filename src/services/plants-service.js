import plantModel from "../models/plants";
import { CustomError } from "../utils/custom-error.js";
import aws from "aws-sdk";

export const PlantsService = {
  async getAllPlants(page) {
    try {
      let plants = await plantModel.paginate(
        {},
        { page, populate: { path: "createdBy", select: "firstName lastName" } }
      );
      return plants;
    } catch (error) {
      throw error;
    }
  },

  async findPlants() {
    try {
      const data = await plantModel.find().populate("createdBy");
      return data;
    } catch (error) {
      throw new CustomError(500, "Internal Server Error");
    }
  },

  async deletePlant(id) {
    try {
      const plant = await plantModel.findByIdAndDelete(id);
      return "Plant deleted succesfully";
    } catch (error) {
      throw new CustomError(404, "Plant not found or already deleted");
    }
  },
  async createPlant(plant, user, file) {
    try {
      const data = await uploadPhoto(user, file);
      const plantResponse = await new plantModel({
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
const uploadPhoto = (user, file) => {
  console.log(file);
  const params = {
    Bucket: "agrotic-resources",
    Key: `plantsPictures/${Date.now() + file.originalname}`,
    Body: file.buffer,
  };
  const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  });
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

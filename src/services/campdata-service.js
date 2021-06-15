import { CampDataModel } from "../models/campdata";
import { CustomError } from "../utils/custom-error";

export const CampDataService = {
  async addDataCamp(campDataDto) {
    try {
      const register = await new CampDataModel(campDataDto).save();
      return register;
    } catch (error) {
      console.log(error);
      throw new CustomError(500, "Internal server Error");
    }
  },
  async getCampDataByPlant(id) {
    try {
      const registers = await CampDataModel.find()
        .where("idPlant")
        .equals(id)
        .sort("date");
      return registers;
    } catch (error) {
      throw new CustomError(500, "Internal Server Error");
    }
  },
};

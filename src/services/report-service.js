import plantModel from "../models/plants";
import { CustomError } from "../utils/custom-error";

export const ReportService = {
  async getPlantsCreatedByReport() {
    try {
      const reports = await plantModel
        .aggregate([
          {
            $group: {
              _id: "$createdBy",
              obj: {
                $push: {
                  commonName: "$commonName",
                  cientificName: "$cientificName",
                },
              },
            },
          },
        ])
        .exec();
      return reports;
    } catch (error) {
      console.log(error);
      throw CustomError(500, "No report");
    }
  },
};

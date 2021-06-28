import plantModel from "../models/plants";
import UserModel from "../models/user";
import _ from "lodash";
import { CampDataModel } from "../models/campdata";

export const ReportService = {
  async getPlantsCreatedByReport() {
    return new Promise((resolve, reject) => {
      plantModel
        .aggregate([
          {
            $group: {
              _id: "$createdBy",
              plants: {
                $push: {
                  commonName: "$commonName",
                  cientificName: "$cientificName",
                },
              },
            },
          },
        ])
        .exec((err, reports) => {
          if (err) {
            reject(err);
          }
          UserModel.populate(
            reports,
            { path: "_id", select: "firstName lastName -_id" },
            (err, populatedReports) => {
              if (err) {
                reject(err);
              }
              resolve(
                populatedReports.map((item) => ({
                  createdBy: `${item._id.firstName} ${item._id.lastName}`,
                  amount: item.plants.length,
                }))
              );
            }
          );
        });
    });
  },
  getPlantsDailyReport() {
    return new Promise((resolve, reject) => {
      plantModel
        .aggregate([
          {
            $project: {
              dayDate: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              name: "$commonName",
            },
          },
        ])
        .exec((err, plants) => {
          if (err) {
            reject(err);
          }
          const reports = _.groupBy(plants, "dayDate");
          resolve(
            Object.entries(reports).map((item) => ({
              date: item[0],
              amount: item[1].length,
            }))
          );
        });
    });
  },

  getCampDataDailyReport(){
    return new Promise((resolve, reject) => {
      CampDataModel
        .aggregate([
          {
            $project: {
              dayDate: {
                $dateToString: { format: "%Y-%m-%d", date: "$date" },
              },
            },
          },
        ])
        .exec((err, plants) => {
          if (err) {
            reject(err);
          }
          const reports = _.groupBy(plants, "dayDate");
          resolve(
            Object.entries(reports).map((item) => ({
              date: item[0],
              amount: item[1].length,
            }))
          );
        });
    });
  }
};

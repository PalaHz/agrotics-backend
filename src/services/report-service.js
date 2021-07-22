import plantModel from "../models/plants";
import UserModel from "../models/user";
import {PlaceModel} from "../models/place"
import _ from "lodash";
import { CampDataModel } from "../models/campdata";
import { CustomError } from "../utils/custom-error.js";


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

  getCampDataDailyReport() {
    return new Promise((resolve, reject) => {
      CampDataModel.aggregate([
        {
          $project: {
            dayDate: {
              $dateToString: { format: "%Y-%m-%d", date: "$date" },
            },
          },
        },
      ]).exec((err, plants) => {
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
  async getGeneralStatistics() {
    const statistics = { users: 0, plants: 0, places: 0 };
    try {
      const usersCount = await UserModel.count()
      const plantsCount = await plantModel.count()
      const placesCount = await PlaceModel.count()
      statistics.users = usersCount;
      statistics.plants = plantsCount;
      statistics.places = placesCount;
      return statistics
    } catch (error) {
      throw new CustomError(500, 'Internal server error')
    }
  },
};

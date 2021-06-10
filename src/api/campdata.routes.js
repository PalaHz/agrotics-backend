import express from "express";
import { CampDataService } from "../services/campdata-service";
import { authenticateJwt } from "../middlewares/authorization";
import { body, validationResult } from "express-validator";

export const campDataRoutes = express.Router();

campDataRoutes.post("/", async(req, res) => {
  try {
    const response = await CampDataService.addDataCamp(req.body);
    res.status(200).json(response);
  } catch (error) {
    res.status(error.status).json(error);
  }
});

import express from "express";
import { PlantsService } from "../services/plants-service";
import { authenticateJwt } from "../middlewares/authorization";
import { body, validationResult } from "express-validator";
import { ReportService } from "../services/report-service";

/* Multer */
import multer from "multer";
const upload = multer();

/* Router */
const plantsRouter = express.Router();

//Plants
plantsRouter.get("/table/", authenticateJwt, async (req, res) => {
  try {
    let filters = {}
    if(req.query.place) filters.place = req.query.place;
    if(req.query.author) filters.createdBy = req.query.author;
    const page = req.query.page;
    const plants = await PlantsService.getAllPlants(page, filters);
    res.json(plants);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

plantsRouter.delete("/", async (req, res) => {
  try {
    const message = await PlantsService.deletePlant(req.query.id);
    res.json({ message });
  } catch (error) {
    res.status(error.status).send(error.message);
  }
});

plantsRouter.post(
  "/",
  upload.single("file"),
  body("commonName").isString(),
  authenticateJwt,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const plant = await PlantsService.createPlant(
        req.body,
        res.locals.user,
        req.file
      );
      res.json({ ...plant });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

plantsRouter.get("/:id", async (req, res) => {
  try {
    const plant = await PlantsService.getPlantById(req.params.id);
    res.json(plant);
  } catch (error) {
    res.status(error.status).send(error.message);
  }
});

plantsRouter.put(
  "/:id",
  upload.single("file"),
  body("commonName").isString(),
  authenticateJwt,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const plant = await PlantsService.updatePlantById(
        req.params.id,
        req.body,
        req.file
      );
      res.json({ ...plant });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

/* Reports */

plantsRouter.get("/report/general-report", async (req, res) => {
  ReportService.getPlantsCreatedByReport()
    .then((report) => {
      res.json(report);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

plantsRouter.get("/report/daily-report", async (req, res) => {
  try {
    const report = await ReportService.getPlantsDailyReport();
    res.json(report)
  } catch (error) {
    res.status(500).json(error)
  }
});


plantsRouter.get("/report/camp-data-daily-report", async (req, res) => {
  try {
    const report = await ReportService.getCampDataDailyReport();
    res.json(report)
  } catch (error) {
    res.status(500).json(error)
  }
});

export default plantsRouter;

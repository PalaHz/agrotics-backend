import express from "express";
import { authenticateJwt } from "../middlewares/authorization";
import { PlantsService } from "../services/plants-service";
import { body, validationResult } from "express-validator";
const plantsRouter = express.Router();
import multer from "multer";
const upload = multer();
//Plants
plantsRouter.get("/table/", authenticateJwt, async (req, res) => {
  try {
    const page = req.query.page;
    const plants = await PlantsService.getAllPlants(page);
    res.json(plants);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

plantsRouter.delete(
  "/",
  async (req, res) => {
    try {
      const message = await PlantsService.deletePlant(req.query.id);
      res.json({ message });
    } catch (error) {
      res.status(error.status).send(error.message);
    }
  }
);

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
      const plant = await PlantsService.createPlant(req.body, res.locals.user, req.file);
      res.json({...plant})
    } catch (error) {
      res.status(500).send(error.message)
    }
  }
);

plantsRouter.get('/:id', async(req, res)=>{
  try {
    const plant = await PlantsService.getPlantById(req.params.id);
    res.json(plant);
  } catch (error) {
    res.status(error.status).send(error.message)
  }
})

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
      const plant = await PlantsService.updatePlantById(req.params.id, req.body, req.file);
      res.json({...plant})
    } catch (error) {
      res.status(500).send(error.message)
    }
  }
);

//Register
plantsRouter.post("/register");
plantsRouter.put("/register");

export default plantsRouter;

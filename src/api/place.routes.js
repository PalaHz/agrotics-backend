import express, { json } from "express";
import { PlaceService } from "../services/places-service";

export const PlacesRouter = express.Router();

PlacesRouter.post("/", async (req, res) => {
  try {
    const place = await PlaceService.createPlace(req.body);
    res.json(place);
  } catch (error) {
    res.status(error.status || 500).json({message:error.message})
  }
});

PlacesRouter.get("/table", async (req, res) => {
  try {
    const place = await PlaceService.getPlants(req.query.page)
    res.json(place)
  } catch (error) {
    res.status(error.status || 500).json({message:error.message})
  }
});

PlacesRouter.get('/list', async (req, res)=>{
  try {
    const places = await PlaceService.getAllPlaces()
    res.json(places)
  } catch (error) {
    res.status(error.status || 500).json(error)
  }
})

import express from "express";
import { CampDataService } from "../services/campdata-service";
import fs from "fs";
import { CustomError } from "../utils/custom-error";
import xlsx from "json-as-xlsx";
export const campDataRoutes = express.Router();

campDataRoutes.post("/", async (req, res) => {
  try {
    const response = await CampDataService.addDataCamp(req.body);
    res.status(200).json(response);
  } catch (error) {
    res.status(error.status).json(error);
  }
});

campDataRoutes.get("/:id", async (req, res) => {
  try {
    const registers = await CampDataService.getCampDataByPlant(req.params.id);
    res.json(registers);
  } catch (error) {
    res.status(error.status).json(error);
  }
});

campDataRoutes.get("/download-report/:id", async (req, res) => {
  try {
    const registers = await CampDataService.getCampDataByPlant(req.params.id);
    console.log(registers);
    let data = [
      {
        sheet: "Report",
        columns: [
          { label: "Ubicacion", value: "location" }, // Top level data
          { label: "Fecha", value: "date" }, // Run functions
          { label: "Lote", value: "lote" },
          { label: "Area Plantada", value: "plantedArea" },
          { label: "Tiempo de seimbra", value: "seedTime" },
          { label: "Germinacion", value: "germination" },
          { label: "Altura", value: "heigth" },
          { label: "Diametro", value: "diameter" },
          { label: "Ramas", value: "bunches" },
          { label: "Flores por rama", value: "flowersPerBunch" },
          { label: "Flores totales", value: "totalFlowers" },
          { label: "Frutos por rama", value: "fruitPerBunch" },
          { label: "Frutos totales", value: "totalFruit" },
          { label: "Largo del fruto", value: "fruitLength" },
          { label: "Diametro del futo", value: "fruitDiameter" },
          { label: "Peso del fruto", value: "fruitWeigth" },
          { label: "Produccion por planta", value: "productionPerPlant" },
          { label: "Ph del suelo", value: "groundPh" },
          { label: "Mo", value: "mo" },
          { label: "Nitrogeno", value: "nitrogen" },
          { label: "Fosforo", value: "match" },
          { label: "Potasio", value: "potassium" },
          { label: "Otros elementos", value: "otherElements" },
          { label: "Temperatura", value: "temperature" },
          { label: "Humedad relativa", value: "relativeHumidity" },
          { label: "Riego / Lluvia", value: "irrigationRain" },
          { label: "Fertilizacion", value: "fertilizer" },
          { label: "Fecha de Fertilizacion", value: "fertilizerDate" },
          { label: "Control de plagas", value: "plagueControl" },
          {
            label: "Cantidad de control de plagas",
            value: "plagueControlAmount",
          },
          { label: "Fecha Control de plagas", value: "plagueControlDate" },
          { label: "Observaciones", value: "observations" },
        ],
        content: registers,
      },
    ];

    let settings = {
      writeOptions: {
        type: "buffer",
        bookType: "xlsx",
      }, // Style options from https://github.com/SheetJS/sheetjs#writing-options
    };
    let buffer = xlsx(data, settings);
    res.writeHead(200, {
      "Content-Type": "application/octet-stream",
      "Content-disposition": `attachment; filename=MySheet.xlsx`,
    });
    res.end(buffer);
  } catch (error) {
    console.log(error);
    res.status(error.status).json(error);
  }
});

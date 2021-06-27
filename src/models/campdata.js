import mongoose, { Schema, model } from "mongoose"

const CampDataSchema = new Schema({
  idPlant: { type: mongoose.Types.ObjectId, ref: "plants" },
  location: { type: String },
  date: { type: Date, default: Date.now },
  lote: { type: String },
  /* m2 */
  plantedArea: { type: Number },
  seedTime: { type: Date },
  germination: { type: Number },
  /* cm */
  heigth: { type: Number },
  /* cm */
  diameter: { type: Number },
  /* Racimos */
  bunches: { type: Number },
  flowersPerBunch: { type: Number },
  totalFlowers: { type: Number },
  fruitPerBunch: { typ: Number },
  totalFruit: { type: Number },
  /* cm */
  fruitLength: { type: Number },
  /* cm */
  fruitDiameter: { type: Number },
  /* g */
  fruitWeigth: { type: Number },
  /* kg */
  productionPerPlant: { type: Number },
  groundPh: { type: Number },
  /* % */
  mo: { type: Number },
  /* % */
  nitrogen: { type: Number },
  /* %Fosforo  (mg/hg)*/
  match: { type: Number },
  /* cmol/kg */
  potassium: { type: Number },
  /* Other elements  */
  otherElements: { type: String },
  /* C */
  temperature: { type: Number },
  /* % */
  relativeHumidity: { type: Number },
  /* ml/planta */
  irrigationRain: { type: Number },
  fertilizer: { type: String },
  /* g/planta */
  fertilizer: { type: Number },
  fertilizerDate: { type: Date },
  plagueControl: { type: String },
  plagueControlAmount: { type: Number },
  plagueControlDate: { type: Number },
  observations: { type: String },
});

export const CampDataModel = model('CampData', CampDataSchema)

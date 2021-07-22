import { model, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const arrayLimit = (val) => {
  return val.length <= 2;
};
const PlaceSchema = new Schema({
  name: { type: String, required: true, unique: true },
  date: { type: Date, required: true, default: Date.now() },
  desc: { type: String },
  coordenates: {
    type: [{ type: Number }],
    validate: [arrayLimit, "Only 2 values long, lat"],
  },
});

PlaceSchema.plugin(mongoosePaginate);
const PlaceModel = model("Place", PlaceSchema);
PlaceModel.paginate();
module.exports = { PlaceModel };

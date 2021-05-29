import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
mongoose
  .connect(
    `mongodb://localhost:27017/agrotic`,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
  )
  .then(() => {
    console.log("DB COnnected");
  })
  .catch((err) => {
    console.log(err);
  });

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

//Importar variables de entorno locales
require('dotenv').config({path: '.env'});
console.log(process.env.DB_URL);
mongoose
  .connect(process.env.DB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
  )
  .then(() => {
    console.log("DB COnnected");
  })
  .catch((err) => {
    console.log(err);
  });

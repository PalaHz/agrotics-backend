import express from "express";
import userRouter from "./api/user.routes";
import plantsRouter from "./api/plants.routes";
import cors from "cors";
import morgan from "morgan";

const app = express();
const port = 5500; // default port to listen

/* Config */
import "./config/database";
import { campDataRoutes } from "./api/campdata.routes";
app.get("/", (req, res) => {
  res.json({ message: "Ok succes actualizado cors MANUEL AA" });
});
/* Middlewares */
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/* Routers */
app.use("/users", userRouter);
app.use("/plants", plantsRouter);
app.use("/campData", campDataRoutes);

// start the express server
app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});

import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import "dotenv/config";

import apiRoutes from "./routes/api/index.js";

const app = express();

app.use(morgan("dev"));
app.use(cors());

app.use(express.json());
app.use(cookieParser());

app.use("/api", apiRoutes);
app.use(express.json());
export default app;

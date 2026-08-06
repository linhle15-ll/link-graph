import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import "dotenv/config";
import {
  globalErrorHandler,
  authenticate,
  AppError,
} from "./middleware/index.js";
import apiRoutes from "./routes/index.js";
const app = express();

app.use(morgan("dev"));
app.use(cors());

app.use(express.json());
app.use(cookieParser());

app.use("/api", authenticate, apiRoutes);
// triggered a route not found
app.use((req, res, next) =>
  next(AppError.notFound(`Route ${req.originalUrl} not found`)),
);
app.use(globalErrorHandler);
export default app;

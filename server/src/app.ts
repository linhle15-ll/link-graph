import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

// import routes from "./routes";

const app = express();

app.use(morgan("dev"));
app.use(cors());

app.use(express.json());
app.use(cookieParser());

// app.use("/api", routes);

export default app;
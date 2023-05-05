import express from "express";
import logger from "morgan";
import cors from "cors";
import contactRouter from "./routes/api/contacts-routes.js";
import authRouter from './routes/api/auth-routes.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/users",authRouter);
app.use("/api/contacts", contactRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Something went wrong . Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

export default app;

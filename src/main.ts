import "reflect-metadata";
import dotenv from 'dotenv';
import express from 'express';
import "./core/db";
import cors from "cors";
import userDetailRouter from "./module/userDetails/userDetails.controller";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;
app.use(express.json({ limit: "50mb" }));
app.use(cors());
let corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};
app.use('/userDetailsRouter', cors(corsOptions), userDetailRouter);

app.listen(PORT, () => console.log(`server upon port ${PORT}`));

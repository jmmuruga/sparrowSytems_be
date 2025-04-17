import "reflect-metadata";
import dotenv from "dotenv";
import express from "express";
import "./core/db";
import cors from "cors";
import userDetailRouter from "./module/userDetails/userDetails.controller";
import loginModuleRouter from "./module/loginModule/loginModule.controller";

import productRouter from "./module/productModule/product.controller"
import bannerRouter from "./module/bannerModule/banner.controller";
import brandRouter from "./module/brandModule/brand.controller";
import categoryRouter from "./module/categorymodule/category.controller";
import categoryNestedRouter from "./module/categoryNested/categoryNested.controller";


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


app.use("/userDetailsRouter", cors(corsOptions), userDetailRouter);
app.use('/loginModuleRouter', cors(corsOptions), loginModuleRouter);

app.use("/productRouter", cors(corsOptions), productRouter);
app.use("/bannerRouter", cors(corsOptions), bannerRouter);
app.use('/brandRouter', cors(corsOptions), brandRouter);
app.use('/categoryRouter', cors(corsOptions),categoryRouter );
app.use('/categoryNestedRouter', cors(corsOptions),categoryNestedRouter );


app.listen(PORT, () => console.log(`server upon port ${PORT}`));

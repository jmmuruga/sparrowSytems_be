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
import customerDetailRouter from "./module/customerDetails/customerDetails.controller";
import allOrdersRouter from "./module/allOrdersModule/allOrders.controller";
import customerCartRouter from "./module/customerCartModule/customerCart.controller";
import customerAddressRouter from "./module/Address/customerAddress.controller";
import ordersRouter from "./module/ordersModule/orders.controller";


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
app.use('/customerDetailRouter', cors(corsOptions),customerDetailRouter );
app.use('/allOrdersRouter', cors(corsOptions), allOrdersRouter);
app.use('/customerCartRoute', cors(corsOptions), customerCartRouter);
app.use('/customerAddressRouter', cors(corsOptions), customerAddressRouter);
app.use('/ordersRouter', cors(corsOptions), ordersRouter);



app.listen(PORT, () => console.log(`server upon port ${PORT}`));

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
// import allOrdersRouter from "./module/allOrdersModule/allOrders.controller";
import customerCartRouter from "./module/customerCartModule/customerCart.controller";
import customerAddressRouter from "./module/Address/customerAddress.controller";
import ordersRouter from "./module/ordersModule/orders.controller";
import eventRouter from "./module/eventModule/event.controller";
import breadcrampsRouter from "./module/breadcramps/breadcramps.controller";
import currentOpeningsRouter from "./module/currentOpenings/currentOpenings.controller";
import applicationRouter from "./module/application/application.controller";
import courierRouter from "./module/courier/courier.controller";
import homeSettingRouter from "./module/homePageSettingsModule/homeSettings.controller";
import generalSettingRouter from "./module/generalSettingModule/general.controller";
import recentoffersRouter from "./module/recentOffersModule/recentOffers.controller";
import recentOffersRouter from "./module/recentOffersModule/recentOffers.controller";
import newProductsRouter from "./module/newProductsModule/newProducts.controller";
import getInTouchRouter from "./module/getInTouchModule/getInTouch.controller";
import variationRouter from "./module/variation/variation.controller";



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
// app.use('/allOrdersRouter', cors(corsOptions), allOrdersRouter);
app.use('/customerCartRoute', cors(corsOptions), customerCartRouter);
app.use('/customerAddressRouter', cors(corsOptions), customerAddressRouter);
app.use('/ordersRouter', cors(corsOptions), ordersRouter);
app.use('/eventRouter', cors(corsOptions), eventRouter);
app.use('/breadcrampsRouter', cors(corsOptions), breadcrampsRouter);
app.use('/currentOpeningsRouter', cors(corsOptions), currentOpeningsRouter);
app.use('/applicationRouter', cors(corsOptions), applicationRouter);
app.use('/courierRouter', cors(corsOptions),courierRouter);
app.use('/homeSettingRouter', cors(corsOptions), homeSettingRouter);
app.use('/generalSettingRouter', cors(corsOptions), generalSettingRouter);
app.use('/recentOffersRouter', cors(corsOptions), recentOffersRouter);
app.use('/newProductsRouter', cors(corsOptions), newProductsRouter);
app.use('/getInTouchRouter', cors(corsOptions), getInTouchRouter);
app.use('/variationRouter', cors(corsOptions), variationRouter);


app.listen(PORT, () => console.log(`server upon port ${PORT}`));

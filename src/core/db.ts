import "dotenv/config";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { UserDetails } from "../module/userDetails/userDetails.model";
import { products } from "../module/productModule/product.model";
import { banner } from "../module/bannerModule/banner.model";
import { BrandDetail } from "../module/brandModule/brand.model";
import { Category, } from "../module/categorymodule/category.model";
import { CategoryNested } from "../module/categoryNested/categoryNested.model";
import { customerDetails } from "../module/customerDetails/customerDetails.model";
import { allOrders } from "../module/allOrdersModule/allOrders.model";
import { CustomerCart } from "../module/customerCartModule/customerCart.model";
import { customerAddress } from "../module/Address/customerAddress.model";
import { orders } from "../module/ordersModule/orders.model";
import { events } from "../module/eventModule/event.model";
import { breadCramps } from "../module/breadcramps/breadcramps.model";
import { currentOpenings } from "../module/currentOpenings/currentOpenings.model";
import { application } from "../module/application/application.model";
import { courier } from "../module/courier/courier.model";
import { homeSettings } from "../module/homePageSettingsModule/homeSettings.model";
import { GeneralSettings } from "../module/generalSettingModule/general.model";
const Entities: any[] = [
  UserDetails,
  products,
  banner,
  BrandDetail,
  Category,
  CategoryNested,
  customerDetails,
  allOrders,
  CustomerCart,
  customerAddress,
  orders,
  events,
  breadCramps,
  currentOpenings,
  application,
  courier,
  homeSettings,
  GeneralSettings,

]
export const appSource = new DataSource({
  type: "mssql",
  host: process.env.DB_SERVER_HOST,
  port: parseInt(process.env.DB_PORT as string),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: Entities,
  synchronize: true,
  logging: false,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    cryptoCredentialsDetails: {
      minVersion: "TLSv1",
      trustServerCertificate: true,
    },
    encrypt: false
    // requestTimeout: 300000
  },
  extra: {
    trustServerCertificate: true,
    requestTimeout: 60000
  },
});
appSource.initialize()
  .then((res) => console.log('SQL server connected successfully'))
  .catch((error) => console.log('Error while connecting to DataBase', error))
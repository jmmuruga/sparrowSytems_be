import { Router } from "express";
import { addCustomerCart } from "./customerCart.services";

const customerCartRouter = Router();

customerCartRouter.post('/addCustomerCart', (req, res) => { addCustomerCart(req, res); });

export default customerCartRouter;
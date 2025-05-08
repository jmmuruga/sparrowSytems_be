import { Router } from "express";
import { addCustomerCart, removeCustomerCart } from "./customerCart.services";

const customerCartRouter = Router();

customerCartRouter.post('/addCustomerCart', (req, res) => { addCustomerCart(req, res); });
customerCartRouter.post('/removeCustomerCart', (req, res) => {removeCustomerCart(req, res); });

export default customerCartRouter;
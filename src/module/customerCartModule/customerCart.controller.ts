import { Router } from "express";
import { addCustomerCart, clearCustomerCart, getCustomerCartDetails, removeCustomerCart } from "./customerCart.services";

const customerCartRouter = Router();

customerCartRouter.post('/addCustomerCart', (req, res) => { addCustomerCart(req, res); });
customerCartRouter.post('/removeCustomerCart', (req, res) => {removeCustomerCart(req, res); });
customerCartRouter.get('/getCustomerCartDetails/:customerid', (req, res) =>{getCustomerCartDetails(req, res); });
customerCartRouter.delete('/clearCustomerCart/:customerid', (req, res) =>{clearCustomerCart(req, res); });
export default customerCartRouter;
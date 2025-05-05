import { Router } from "express";
import { addAllOrders, getAllOrderDetails } from "./allOrders.service";

const allOrdersRouter = Router();

allOrdersRouter.post('/addAllOrders', (req, res) => { addAllOrders(req, res); });
allOrdersRouter.get('/getAllOrderDetails', ( req, res) => {getAllOrderDetails(req, res)});



export default allOrdersRouter;
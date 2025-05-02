import { Router } from "express";
import { addAllOrders } from "./allOrders.service";

const allOrdersRouter = Router();

allOrdersRouter.post('/addAllOrders', (req, res) => { addAllOrders(req, res); });



export default allOrdersRouter;
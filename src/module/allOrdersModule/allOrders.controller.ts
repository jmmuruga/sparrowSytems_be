import { Router } from "express";
import { newAllOrders } from "./allOrders.service";

const allOrdersRouter = Router();

allOrdersRouter.post('/newAllOrders', (req, res) => { newAllOrders(req, res); });



export default allOrdersRouter;
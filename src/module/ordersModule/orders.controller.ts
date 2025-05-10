import { Router } from "express";
import { addAllOrders } from "./orders.service";

const ordersRouter = Router();

ordersRouter.post('/addAllOrders', (req, res) => {addAllOrders(req, res);});

export default ordersRouter;
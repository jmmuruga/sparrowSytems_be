import { Router } from "express";
import { addAllOrders, changeOrderStatus, getAllOrderDetails, getOrderDetails, getOrderId } from "./orders.service";

const ordersRouter = Router();

ordersRouter.post('/addAllOrders', (req, res) => {addAllOrders(req, res);});
ordersRouter.get('/getOrderDetails/:orderid', (req, res) => {getOrderDetails(req, res);});
ordersRouter.post('/changeOrderStatus/', (req, res) => {changeOrderStatus(req, res);});
ordersRouter.get('/getAllOrderDetails', (req, res) => {getAllOrderDetails(req, res);});
ordersRouter.get('/getOrderId', (req, res) => {getOrderId(req, res); });

export default ordersRouter;
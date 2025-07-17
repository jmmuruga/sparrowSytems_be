import { Router } from "express";
import { addAllOrders, changeOrderStatus, getAllOrderDetails, getLatestOrders, getOrderDetails, getOrderDetailsByCustomer, getOrderId } from "./orders.service";
import { auth } from "../../shared/helper";


const ordersRouter = Router();

ordersRouter.post('/addAllOrders', (req, res) => {addAllOrders(req, res)});
ordersRouter.get('/getOrderDetails/:orderid', (req, res) => {getOrderDetails(req, res)});
ordersRouter.post('/changeOrderStatus/',auth, (req, res) => {changeOrderStatus(req, res)});
ordersRouter.get('/getAllOrderDetails', (req, res) => {getAllOrderDetails(req, res)});
ordersRouter.get('/getOrderId', (req, res) => {getOrderId(req, res); });
ordersRouter.get('/getLatestOrders', (req, res) => {getLatestOrders(req, res); });
ordersRouter.get('/getcustomerOrderDetails/:customerid', (req, res) => {getOrderDetailsByCustomer(req, res); });



export default ordersRouter;
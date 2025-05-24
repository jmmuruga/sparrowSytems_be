import { Router } from "express";
import { addCourier, getCourier } from "./courier.services";

const courierRouter = Router();

courierRouter.post('/addcourier',(req, res) => { addCourier(req, res);
});
courierRouter.get('/getcourier',(req, res) => { getCourier(req, res);
});



export default  courierRouter 
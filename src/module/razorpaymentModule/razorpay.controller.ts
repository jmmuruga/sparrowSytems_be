import { Router } from "express";
import { createRazorpayOrder } from "./razorpay.service";

const razorPayRouter = Router();

razorPayRouter.post('/razorpayemnt', createRazorpayOrder);

export default razorPayRouter;

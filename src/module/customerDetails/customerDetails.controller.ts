import { Router } from "express";
import {
  deleteCustomer,
  getCustomer,
  newCustomer,
  requestPasswordReset,
  resendPasswordOtp,
  sendOtpInEmail,
  Userlogin,
} from "./customerDetails.services";
import { auth } from "../../shared/helper";


const customerDetailRouter = Router();

customerDetailRouter.post("/addCustomer", (req, res) => {
  newCustomer(req, res);
});

customerDetailRouter.post("/userlogin", (req, res) => {
  Userlogin(req, res);
});
customerDetailRouter.get("/getCustomer", (req, res) => {
  getCustomer(req, res);
});
customerDetailRouter.delete("/deletecustomer/:customerid/:userId", auth, (req, res) => {
  deleteCustomer(req, res);
});

customerDetailRouter.get("/forgotPassword/:email", (req, res) => {
  requestPasswordReset(req, res);
});

customerDetailRouter.get("/otprequest/:email", (req, res) => {
  sendOtpInEmail(req, res);
});

customerDetailRouter.get("/otpsend/:email", (req, res) => {
  resendPasswordOtp(req, res);
});

export default customerDetailRouter;

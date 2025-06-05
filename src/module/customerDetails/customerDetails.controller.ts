import { Router } from "express";
import { deleteCustomer, getCustomer, newCustomer,requestPasswordReset,resendPasswordOtp,sendOtpInEmail,Userlogin } from "./customerDetails.services";

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
customerDetailRouter.delete('/deletecustomer/:customerid',(req, res) => { deleteCustomer(req, res);
});

 customerDetailRouter.get('/forgotPassword/:email', (req , res) => {requestPasswordReset(req, res)});

customerDetailRouter.post('/otprequest', (req , res) => {sendOtpInEmail(req, res)});

customerDetailRouter.get('/otpsend/:email', (req , res) => {resendPasswordOtp(req, res)});






export default customerDetailRouter;

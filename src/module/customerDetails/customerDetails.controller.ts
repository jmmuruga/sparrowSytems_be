import { Router } from "express";
import { deleteCustomer, getCustomer, newCustomer } from "./customerDetails.services";

const customerDetailRouter = Router();

customerDetailRouter.post("/addCustomer", (req, res) => {
  newCustomer(req, res);
});
customerDetailRouter.get("/getCustomer", (req, res) => {
  getCustomer(req, res);
});
customerDetailRouter.delete('/deletecustomer/:customerid',(req, res) => { deleteCustomer(req, res);
});


export default customerDetailRouter;

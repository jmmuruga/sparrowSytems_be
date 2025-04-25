import { Router } from "express";
import { newCustomer } from "./customerDetails.services";

const customerDetailRouter = Router();

customerDetailRouter.post("/addCustomer", (req, res) => {
  newCustomer(req, res);
});

export default customerDetailRouter;

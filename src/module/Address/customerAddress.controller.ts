import { Router } from "express";
import { AddNewAddres,  getAddress, updateCustomerAddress } from "./customerAddress.service";

const customerAddressRouter = Router()
 
customerAddressRouter.post("/addAddress",(req,res) => {
    AddNewAddres(req,res);
})
customerAddressRouter.get("/getAddress/:customerid", (req, res) => {
  getAddress(req, res);
});
customerAddressRouter.post('/changeDelete', (req, res) => {
  updateCustomerAddress(req, res);
});



export default customerAddressRouter

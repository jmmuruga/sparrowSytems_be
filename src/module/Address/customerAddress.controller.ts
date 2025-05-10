import { Router } from "express";
import { AddNewAddres, getAddress } from "./customerAddress.service";

const customerAddressRouter = Router()
 
customerAddressRouter.post("/addAddress",(req,res) => {
    AddNewAddres(req,res);
})
customerAddressRouter.get("/getAddress/:customerid", (req, res) => {
  getAddress(req, res);
});



export default customerAddressRouter
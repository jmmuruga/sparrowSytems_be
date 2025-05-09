import { Router } from "express";
import { AddNewAddres } from "./customerAddress.service";

const customerAddressRouter = Router()
 
customerAddressRouter.post("/addAddress",(req,res) => {
    AddNewAddres(req,res);



})




export default customerAddressRouter
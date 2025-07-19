import { Router } from "express";
import { addImageColour, deleteColour, getcolourVariationData, } from "./productColorVariation.services";
import { auth } from "../../shared/helper";


const productColourVariationRouter = Router()

productColourVariationRouter.post("/addImageColor", auth, (req,res)=>{addImageColour(req,res)});
productColourVariationRouter.get("/getdata",(req,res)=>{getcolourVariationData(req,res)});
productColourVariationRouter.delete("/deleteColour/:id/:userId",auth,(req,res)=>{deleteColour(req,res)});

export default  productColourVariationRouter
import { Router } from "express";
import { addImageColour, deleteColour, getcolourVariationData, } from "./productColorVariation.services";

const productColourVariationRouter = Router()

productColourVariationRouter.post("/addImageColor",(req,res)=>{addImageColour(req,res)});
productColourVariationRouter.get("/getdata",(req,res)=>{getcolourVariationData(req,res)});
productColourVariationRouter.delete("/deleteColour/:id",(req,res)=>{deleteColour(req,res)});

export default  productColourVariationRouter
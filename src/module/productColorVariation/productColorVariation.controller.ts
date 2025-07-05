import { Router } from "express";
import { addImageColour } from "./productColorVariation.services";

const productColourVariationRouter = Router()

productColourVariationRouter.post("/addImageColor",(req,res)=>{addImageColour(req,res)});

 
export default  productColourVariationRouter
import { Router } from "express";
import { addVariation, generateVariationId, getvariation } from "./variation.services";



const variationRouter = Router();
variationRouter.post('/addvariation',(req, res) => { addVariation(req, res);
});
variationRouter.get('/getVariationid' , (req , res) => {generateVariationId(req , res)});
variationRouter.get('/getVariation' , (req , res) => {getvariation(req , res)});


export default  variationRouter
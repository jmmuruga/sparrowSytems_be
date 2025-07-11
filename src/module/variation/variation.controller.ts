import { Router } from "express";
import { addVariation, deleteVariationid, generateVariationId, getUnusedProductList, getvariation, getVariationDetails, getVariationGroup, getVariationName, updateVariation, variationStatus } from "./variation.services";

const variationRouter = Router();

variationRouter.post('/addvariation', (req, res) => {addVariation(req, res);});
variationRouter.get('/getVariationid', (req, res) => { generateVariationId(req, res) });
variationRouter.get('/getVariation', (req, res) => { getvariation(req, res) });
variationRouter.delete("/deletevariationid/:id", (req, res) => {deleteVariationid(req, res);});
variationRouter.post('/update-status', (req, res) => {variationStatus(req, res);});
variationRouter.get('/getVariationGroup', (req, res) => { getVariationGroup(req, res) });
variationRouter.get('/getVariationName', (req, res) => { getVariationName(req, res) });
variationRouter.get('/getVariationDetails/:variationGroupId', (req, res) => { getVariationDetails(req, res) });
variationRouter.post('/updateVariation' , (req , res) => {updateVariation(req ,res)});
variationRouter.post('/updateVariation' , (req , res) => {updateVariation(req ,res)});
variationRouter.get('/getProductList' , (req, res) => {getUnusedProductList(req , res)});



export default variationRouter
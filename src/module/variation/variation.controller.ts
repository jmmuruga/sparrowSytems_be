import { Router } from "express";
import { addVariation, deleteVariationid, generateVariationId, getUnusedProductList, getvariation, getVariationDetails, getVariationGroup, getVariationName, updateVariation, variationStatus } from "./variation.services";
import { auth } from "../../shared/helper";


const variationRouter = Router();

variationRouter.post('/addvariation', auth, (req, res) => {addVariation(req, res);});
variationRouter.get('/getVariationid', (req, res) => { generateVariationId(req, res) });
variationRouter.get('/getVariation', (req, res) => { getvariation(req, res) });
variationRouter.delete("/deletevariationid/:id/:userId",auth,  (req, res) => {deleteVariationid(req, res);});
variationRouter.post('/update-status',auth,  (req, res) => {variationStatus(req, res);});
variationRouter.get('/getVariationGroup', (req, res) => { getVariationGroup(req, res) });
variationRouter.get('/getVariationName', (req, res) => { getVariationName(req, res) });
variationRouter.get('/getVariationDetails/:variationGroupId', (req, res) => { getVariationDetails(req, res) });
variationRouter.post('/updateVariation' ,auth, (req , res) => {updateVariation(req ,res)});
variationRouter.get('/getProductList' , (req, res) => {getUnusedProductList(req , res)});

export default variationRouter
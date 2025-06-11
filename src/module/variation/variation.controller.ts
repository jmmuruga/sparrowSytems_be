import { Router } from "express";
import { addVariation, deleteVariationid, generateVariationId, getvariation, getVariationGroup, getVariationName, variationStatus } from "./variation.services";

const variationRouter = Router();

variationRouter.post('/addvariation', (req, res) => {addVariation(req, res);});
variationRouter.get('/getVariationid', (req, res) => { generateVariationId(req, res) });
variationRouter.get('/getVariation', (req, res) => { getvariation(req, res) });
variationRouter.delete("/deletevariationid/:id", (req, res) => {deleteVariationid(req, res);});
variationRouter.put('/update-status/:status/:id', (req, res) => {variationStatus(req, res);});
variationRouter.get('/getVariationGroup', (req, res) => { getVariationGroup(req, res) });
variationRouter.get('/getVariationName', (req, res) => { getVariationName(req, res) });

export default variationRouter
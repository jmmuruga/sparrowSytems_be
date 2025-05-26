import { Router } from "express";
import { addGetInTouch, getButtonDetails } from "./getInTouch.service";

const getInTouchRouter = Router()

getInTouchRouter.post('/addGetInTouch', (req, res) => {addGetInTouch(req,res)});
getInTouchRouter.get('/getButtonDetails', (req, res) => { getButtonDetails(req, res)})

export default getInTouchRouter;
import { Router } from "express";
import { addRecentOffersSettings, getRecentOffersDetails, getRecentOffersToDisplay } from "./recentOffers.service";

const recentOffersRouter = Router();

recentOffersRouter.post('/addRecentOffersSettings', ( req, res ) => {addRecentOffersSettings( req, res )});
recentOffersRouter.get('/getRecentOffersDetails', (req, res) => { getRecentOffersDetails(req, res)});
recentOffersRouter.get('/getRecentOffersToDisplay', (req, res) => { getRecentOffersToDisplay(req, res)});

export default recentOffersRouter;
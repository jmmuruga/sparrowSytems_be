import { Router } from "express";
import { addNewProducts, getNewProductsDetails, getRecentOffersToDisplay } from "./newProducts.service";

const newProductsRouter = Router()

newProductsRouter.post('/addNewProducts', (req, res) => {addNewProducts(req, res)});
newProductsRouter.get('/getNewProductsDetails', (req,res) => {getNewProductsDetails(req, res)});
newProductsRouter.get('/getRecentOffersToDisplay', (req, res) => { getRecentOffersToDisplay(req, res)});

export default newProductsRouter;
import { Router } from "express";
import { addNewProducts, getNewProductsDetails, getNewProductsToDisplay } from "./newProducts.service";

const newProductsRouter = Router()

newProductsRouter.post('/addNewProducts', (req, res) => {addNewProducts(req, res)});
newProductsRouter.get('/getNewProductsDetails', (req,res) => {getNewProductsDetails(req, res)});
newProductsRouter.get('/getNewProductsToDisplay', (req, res) => { getNewProductsToDisplay(req, res)});

export default newProductsRouter;
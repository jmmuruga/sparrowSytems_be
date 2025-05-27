import { Router } from "express";
import { addNewProducts, getNewProductsDetails } from "./newProducts.service";

const newProductsRouter = Router()

newProductsRouter.post('/addNewProducts', (req, res) => {addNewProducts(req, res)})
newProductsRouter.get('/getNewProductsDetails', (req,res) => {getNewProductsDetails(req, res)})
export default newProductsRouter;
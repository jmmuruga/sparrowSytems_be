import { Router } from "express";
import { addProducts, deleteProduct, getProductsDetails } from "./product.service";

const productRouter = Router();

productRouter.post('/addProducts', (req, res) => { addProducts(req, res);});
productRouter.post('/getProductsDetails', (req, res) => { getProductsDetails(req, res);});
productRouter.post('/deleteProduct', (req, res) => {deleteProduct (req, res);});

export default productRouter;
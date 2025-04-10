import { Router } from "express";
import { addProducts, changeStatusProduct, deleteProduct, getProductsDetails } from "./product.service";

const productRouter = Router();

productRouter.post('/addProducts', (req, res) => { addProducts(req, res);});
productRouter.post('/getProductsDetails', (req, res) => { getProductsDetails(req, res);});
productRouter.post('/deleteProduct/:productid', (req, res) => { deleteProduct (req, res);});
productRouter.put('/changestatus/:status/:brandid',(req, res) => { changeStatusProduct(req, res);});

export default productRouter;
import { Router } from "express";
import { addProducts, changeStatusProduct, deleteProduct, getLatestUpdatedCategory, getNewProducts, getProductsDetails, getRecentOffers } from "./product.service";

const productRouter = Router();

productRouter.post('/addProducts', (req, res) => { addProducts(req, res);});
productRouter.post('/getProductsDetails', (req, res) => { getProductsDetails(req, res);});
productRouter.post('/deleteProduct/:productid', (req, res) => { deleteProduct (req, res);});
productRouter.post('/changestatus',(req, res) => { changeStatusProduct(req, res);});
productRouter.post('/getRecentOffers', (req, res) => { getRecentOffers(req, res);});
productRouter.post('/getNewProducts', (req, res) => { getNewProducts(req, res);});
productRouter.post('/getLatestUpdatedCategory', (req, res) => { getLatestUpdatedCategory(req, res);});
// productRouter.post('/getAccessories', (req, res) => { getAccessories(req, res);});

export default productRouter;
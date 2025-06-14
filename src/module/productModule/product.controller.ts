import { Router } from "express";
import { addProducts, changeStatusProduct, deleteProduct, getNewProductsDetails, getProductsDetails, getTopFirstImage } from "./product.service";

const productRouter = Router();

productRouter.post('/addProducts', (req, res) => { addProducts(req, res)});
productRouter.get('/getProductsDetails', (req, res) => { getProductsDetails(req, res)});
productRouter.post('/deleteProduct/:productid', (req, res) => { deleteProduct (req, res)});
productRouter.post('/changestatus',(req, res) => { changeStatusProduct(req, res)});
productRouter.get('getNewProductsDetails', (req, res) => { getNewProductsDetails(req, res)});
productRouter.get('/getTopFirstImage', (req, res) => { getTopFirstImage(req, res)})
// productRouter.get('/getRecentOffers', (req, res) => { getRecentOffers(req, res)});
// productRouter.get('/getNewProducts', (req, res) => { getNewProducts(req, res)});
// productRouter.get('/getLatestUpdatedCategory', (req, res) => { getLatestUpdatedCategory(req, res)});
// productRouter.post('/getAccessories', (req, res) => { getAccessories(req, res);});

export default productRouter;
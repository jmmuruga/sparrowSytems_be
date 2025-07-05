import { Router } from "express";
import { addProducts, changeStatusProduct, deleteProduct, getimages, getNewAddedProductsDetails, getProductsDetails } from "./product.service";

const productRouter = Router();

productRouter.post('/addProducts', (req, res) => { addProducts(req, res)});
productRouter.get('/getProductsDetails', (req, res) => { getProductsDetails(req, res)});
productRouter.post('/deleteProduct/:productid', (req, res) => { deleteProduct (req, res)});
productRouter.post('/changestatus',(req, res) => { changeStatusProduct(req, res)});
productRouter.get('getNewAddedProductsDetails', (req, res) => { getNewAddedProductsDetails(req, res)});
productRouter.get('/getimages/:id', (req, res) => { getimages(req, res)})

export default productRouter;
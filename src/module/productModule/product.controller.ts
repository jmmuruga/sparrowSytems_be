import { Router } from "express";
import { addProducts, changeStatusProduct, deleteProduct, getCategoryBasedOnBrand, getimages, getimagesForImageId, getNewAddedProductsDetails, getProductsDetails, getProductsWithVariations } from "./product.service";
import { auth } from "../../shared/helper";


const productRouter = Router();

productRouter.post('/addProducts', auth, (req, res) => { addProducts(req, res)});
productRouter.get('/getProductsDetails', (req, res) => { getProductsDetails(req, res)});
productRouter.delete('/deleteProduct/:productid/:userId',  auth, (req, res) => { deleteProduct (req, res)});
productRouter.post('/changestatus',  auth,(req, res) =>  { changeStatusProduct(req, res)});
productRouter.get('getNewAddedProductsDetails', (req, res) => { getNewAddedProductsDetails(req, res)});
productRouter.get('/getimages/:id', (req, res) => { getimages(req, res)});
productRouter.get('/getProductsWithVariations', (req, res)=> {getProductsWithVariations(req,res)});
productRouter.get('/getImagesBasedOnImgId/:id' , (req, res) => {getimagesForImageId(req ,res)});
productRouter.get('/getbrandBasedonCategory/:categoryid/:subcategoryid' , (req, res) => {getCategoryBasedOnBrand(req ,res)});


export default productRouter;
import { Router } from "express";
import { addProduct } from "./product.service";



const productRouter = Router();

productRouter.post('/addProducts', (req, res) => { addProduct(req, res);
});

export default productRouter;
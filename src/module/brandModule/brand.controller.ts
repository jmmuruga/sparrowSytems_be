import { Router } from "express";
import { addBrand } from "./brand.service";
import multer from "multer";



const brandRouter = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

brandRouter.post('/addBrand',upload.single("brandimage"),(req, res) => { addBrand(req, res);
 });
 



export default brandRouter;
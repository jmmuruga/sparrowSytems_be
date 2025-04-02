import { Router } from "express";
import { addBrand, getBrandDetail } from "./brand.service";
import multer from "multer";



const brandRouter = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

brandRouter.post('/addBrand',upload.single("brandimage"),(req, res) => { addBrand(req, res);
 });
brandRouter.get('/getBrandDetail',(req, res) => { getBrandDetail (req, res);
});
 



export default brandRouter;
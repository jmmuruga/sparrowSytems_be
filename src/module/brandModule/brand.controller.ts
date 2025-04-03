import { Router } from "express";
import { addBrand, brandEditDetails, getBrandDetail } from "./brand.service";
import multer from "multer";



const brandRouter = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

brandRouter.post('/addBrand',upload.single("brandimage"),(req, res) => { addBrand(req, res);
 });
brandRouter.get('/getBrandDetail',(req, res) => { getBrandDetail (req, res);
});
brandRouter.get('/editBrand/:brandid',(req, res) => { brandEditDetails (req, res);
});
 



export default brandRouter;
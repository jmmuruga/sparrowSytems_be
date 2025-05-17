import { Router } from "express";
import multer from "multer";
import { addData, getDetail } from "./breadcramps.services";

const breadcrampsRouter = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });
breadcrampsRouter.post('/addata',upload.single("brandimage"),(req, res) => { addData(req, res);
 });

 breadcrampsRouter.get('/getData',(req, res) => { getDetail (req, res);
 });
 

 export default breadcrampsRouter;
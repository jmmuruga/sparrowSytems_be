import { Router } from "express";
import { addBrand,  changeStatusBrand,  deleteBrand,  getActiveBrandCount,  getBrandCount,  getBrandDetail, getTopBrandDetail, updateBrand } from "./brand.service";
import multer from "multer";



const brandRouter = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

brandRouter.post('/addBrand',upload.single("brandimage"),(req, res) => { addBrand(req, res);
 });
brandRouter.get('/getBrandDetail',(req, res) => { getBrandDetail (req, res);
});
brandRouter.get('/editBrand/',(req, res) => { updateBrand (req, res);
});

brandRouter.delete('/deleteBrand/:brandid',(req, res) => { deleteBrand(req, res);
});

brandRouter.post('/changestatus',(req, res) => { changeStatusBrand(req, res);
});
brandRouter.get('/gettopbrand/',(req, res) => { getTopBrandDetail (req, res);
});

 brandRouter.get('/countofbrand/:brandid',(req, res) => { getBrandCount (req, res);
 })

  brandRouter.get('/activecount/:brandname',(req, res) => {  getActiveBrandCount (req, res);
 })

 



export default brandRouter;
import { Router } from "express";
import { addBrand,  changeStatusBrand,  deleteBrand,  getBrandDetail, updateBrand } from "./brand.service";
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

brandRouter.put('/changestatus/:status/:brandid',(req, res) => { changeStatusBrand(req, res);
});
 



export default brandRouter;
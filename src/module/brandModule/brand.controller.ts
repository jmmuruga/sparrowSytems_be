import { Router } from "express";
import { addBrand, changeStatusBrand, deleteBrand, getActiveBrandCount, getBrandCount, getBrandDetail, getTopBrandDetail } from "./brand.service";
import multer from "multer";
import { auth } from "../../shared/helper";
const brandRouter = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

brandRouter.post('/addBrand', upload.single("brandimage"), auth, (req, res) => {
    addBrand(req, res);
});
brandRouter.get('/getBrandDetail',  (req, res) => {
    getBrandDetail(req, res);
});

brandRouter.delete('/deleteBrand/:brandid/:userId', auth, (req, res) => {
    deleteBrand(req, res);
});

brandRouter.post('/changestatus', auth, (req, res) => {
    changeStatusBrand(req, res);
});
brandRouter.get('/gettopbrand/', (req, res) => {
    getTopBrandDetail(req, res);
});

brandRouter.get('/countofbrand/:brandid', auth,(req, res) => {
    getBrandCount(req, res);
})

brandRouter.get('/activecount/:brandid', auth, (req, res) => {
    getActiveBrandCount(req, res);
})

export default brandRouter;
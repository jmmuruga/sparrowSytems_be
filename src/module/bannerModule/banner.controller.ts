import { Router } from "express";
import { changeStatusBanner, deleteBanner, getBannerDetail, newBanner } from "./banner.service";

const bannerRouter = Router();

bannerRouter.post('/newBanner', (req, res) => { newBanner(req, res); });
bannerRouter.post('/getBannerDetail', (req, res) => { getBannerDetail(req, res); });
bannerRouter.get('/deleteBanner' , (req, res) => { deleteBanner(req, res); });
bannerRouter.post('/changestatus',(req, res) => { changeStatusBanner(req, res);});


export default bannerRouter;
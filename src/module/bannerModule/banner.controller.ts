import { Router } from "express";
import { deleteBanner, getBannerDetail, newBanner } from "./banner.service";

const bannerRouter = Router();

bannerRouter.post('/newBanner', (req, res) => { newBanner(req, res); });
bannerRouter.get('/getBannerDetail', (req, res) => { getBannerDetail(req, res); });
bannerRouter.get('/deleteBanner' , (req, res) => { deleteBanner(req, res); });

export default bannerRouter;
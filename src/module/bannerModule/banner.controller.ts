import { Router } from "express";
import { getBannerDetail, newBanner } from "./banner.service";

const bannerRouter = Router();

bannerRouter.post('/newBanner', (req, res) => { newBanner(req, res);
});
bannerRouter.get('/getBannerDetail', (req, res) => { getBannerDetail(req, res);});

export default bannerRouter;
import { Router } from "express";
import { changeStatusBanner, deleteBanner, getBannerDetail, newBanner } from "./banner.service";
import { auth } from "../../shared/helper";


const bannerRouter = Router();

bannerRouter.post('/newBanner', auth, (req, res) => { newBanner(req, res)});
bannerRouter.get('/getBannerDetail', (req, res) => { getBannerDetail(req, res)});
bannerRouter.delete('/deleteBanner/:bannerid/:userId' ,auth, (req, res) => { deleteBanner(req, res)});
bannerRouter.post('/changestatus',auth, (req, res) => { changeStatusBanner(req, res)});

export default bannerRouter;
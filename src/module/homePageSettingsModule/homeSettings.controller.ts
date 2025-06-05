import { Router } from "express";
import { addHomesettings, getHomePageCategoryToDisplay, getHomeSettingsDetails } from "./homeSettings.service";

const homeSettingRouter = Router();

homeSettingRouter.post('/addHomeSettings' , (req, res) => {addHomesettings(req , res)});
homeSettingRouter.get('/getHomeSettingsDetails', (req, res) => { getHomeSettingsDetails(req, res)});
homeSettingRouter.get('/getHomePageCategoryToDisplay', (req, res) => { getHomePageCategoryToDisplay(req,res)});

export default homeSettingRouter;
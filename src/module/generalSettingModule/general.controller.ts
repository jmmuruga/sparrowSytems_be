import { Router } from "express";
import { addGeneralsettings, getGeneralSettingsDetails } from "./general.service";

const generalSettingRouter = Router();

generalSettingRouter.post('/addGeneralsettings', (req, res) => {addGeneralsettings(req , res)});
generalSettingRouter.get('/getGeneralSettingsDetails', (req, res) => { getGeneralSettingsDetails(req, res)});

export default generalSettingRouter;
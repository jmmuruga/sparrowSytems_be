import { Router } from "express";
import { addGeneralsettings, getGeneralSettingsDetails } from "./general.service";
import { auth } from "../../shared/helper";


const generalSettingRouter = Router();

generalSettingRouter.post('/addGeneralsettings', auth, (req, res) => {addGeneralsettings(req , res)});
generalSettingRouter.get('/getGeneralSettingsDetails', (req, res) => { getGeneralSettingsDetails(req, res)});

export default generalSettingRouter;
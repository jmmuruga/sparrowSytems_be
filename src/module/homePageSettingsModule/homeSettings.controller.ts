import { Router } from "express";
import { addHomesettings } from "./homeSettings.service";

const homeSettingRouter = Router();

homeSettingRouter.post('/addHomeSettings' , (req, res) => {addHomesettings(req , res)});



export default homeSettingRouter;
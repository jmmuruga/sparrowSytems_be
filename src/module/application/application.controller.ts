import { Router } from "express";
import { newApplication } from "./Application.services";


const applicationRouter = Router();

applicationRouter.post('/apply',(req, res) => { newApplication(req, res);
});




export default applicationRouter;
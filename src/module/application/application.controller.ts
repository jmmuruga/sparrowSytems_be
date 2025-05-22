import { Router } from "express";
import { getPersonDetails, newApplication } from "./application.services";
import multer from "multer";



const applicationRouter = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

applicationRouter.post('/apply',upload.single("brandimage"),(req, res) => { newApplication(req, res);
});
applicationRouter.get("/getperson/:id", (req, res) => {
  getPersonDetails(req, res);
});





export default applicationRouter;
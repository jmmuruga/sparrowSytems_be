import { Router } from "express";
import { getPersonDetail, getPersonDetails, newApplication } from "./application.services";
import multer from "multer";
import { auth } from "../../shared/helper";




const applicationRouter = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

applicationRouter.post('/apply',upload.single("brandimage"),(req, res) => { newApplication(req, res);
});
applicationRouter.get("/getperson/:id", (req, res) => {
  getPersonDetails(req, res);
});

applicationRouter.get("/getPersons/:applicationid", (req, res) => {
  getPersonDetail(req, res);
});






export default applicationRouter;
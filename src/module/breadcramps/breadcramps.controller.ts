import { Router } from "express";
import multer from "multer";
import { addData, deleteDetail, getDetail } from "./breadcramps.services";

const breadcrampsRouter = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });
breadcrampsRouter.post("/addata", upload.single("brandimage"), (req, res) => {
  addData(req, res);
});

breadcrampsRouter.get("/getData", (req, res) => {
  getDetail(req, res);
});

breadcrampsRouter.delete("/deletedata/:id/:userId", (req, res) => {
  deleteDetail(req, res);
});

export default breadcrampsRouter;

import { Router } from "express";
import {
  addCategory,
  changeStatusCategory,
  deleteCategory,
  getCatAndSubcat,
  getCategory,
  getHeaderCategory,
} from "./category.service";
import { auth } from "../../shared/helper";


const categoryRouter = Router();

categoryRouter.post("/addCategory", auth, (req, res) => {
  addCategory(req, res);
});
categoryRouter.get("/getCategory", (req, res) => {
  getCategory(req, res);
});
categoryRouter.delete("/deletecategory/:categoryid/:userId", auth, (req, res) => {
  deleteCategory(req, res);
});

categoryRouter.post("/changestatus", auth, (req, res) => {
  changeStatusCategory(req, res);
});
categoryRouter.get("/getHeaderCategory",  (req, res) => {
  getHeaderCategory(req, res);
});

categoryRouter.get("/getCatAndSubcat", (req, res) => { getCatAndSubcat(req, res) });

export default categoryRouter;

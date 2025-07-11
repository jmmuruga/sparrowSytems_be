import { Router } from "express";
import {
  addCategory,
  changeStatusCategory,
  deleteCategory,
  getCatAndSubcat,
  getCategory,
  getHeaderCategory,
} from "./category.service";

const categoryRouter = Router();

categoryRouter.post("/addCategory", (req, res) => {
  addCategory(req, res);
});
categoryRouter.get("/getCategory", (req, res) => {
  getCategory(req, res);
});
categoryRouter.delete("/deletecategory/:categoryid", (req, res) => {
  deleteCategory(req, res);
});

categoryRouter.post("/changestatus", (req, res) => {
  changeStatusCategory(req, res);
});
categoryRouter.get("/getHeaderCategory", (req, res) => {
  getHeaderCategory(req, res);
});

categoryRouter.get("/getCatAndSubcat", (req, res) => { getCatAndSubcat(req, res) });

export default categoryRouter;

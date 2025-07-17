import { Router } from "express";
import {
  addCourier,
  courierStatus,
  deletecourierDetails,
  getCourier,
} from "./courier.services";
import { auth } from "../../shared/helper";

const courierRouter = Router();

courierRouter.post("/addcourier", auth, (req, res) => {
  addCourier(req, res);
});
courierRouter.get("/getcourier", auth, (req, res) => {
  getCourier(req, res);
});
courierRouter.post("/updatestatus",auth, (req, res) => {
  courierStatus(req, res);
});
courierRouter.delete("/deletecourier/:id/:userId",auth, (req, res) => {
  deletecourierDetails(req, res);
});

export default courierRouter;

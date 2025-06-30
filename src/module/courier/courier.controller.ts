import { Router } from "express";
import {
  addCourier,
  courierStatus,
  deletecourierDetails,
  getCourier,
} from "./courier.services";

const courierRouter = Router();

courierRouter.post("/addcourier", (req, res) => {
  addCourier(req, res);
});
courierRouter.get("/getcourier", (req, res) => {
  getCourier(req, res);
});
courierRouter.post("/updatestatus", (req, res) => {
  courierStatus(req, res);
});
courierRouter.delete("/deletecourier/:id", (req, res) => {
  deletecourierDetails(req, res);
});

export default courierRouter;

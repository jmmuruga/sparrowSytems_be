import { Request, Response } from "express";
import { HttpException, ValidationException } from "../../core/exception";
import { appSource } from "../../core/db";
import {
  allOrdersDto,
  allOrdersValidation,
  updateAllOrdersValidation,
} from "./allOrders.dto";
import { allOrders } from "./allOrders.model";

export const addAllOrders = async (req: Request, res: Response) => {
  const payload: allOrdersDto = req.body;
  console.log(payload, "payload");
  try {
    const AllOrdersRepository = appSource.getRepository(allOrders);
    if (payload.orderid) {
      console.log("came nto update");
      const validation = updateAllOrdersValidation.validate(payload);
      if (validation?.error) {
        throw new ValidationException(validation.error.message);
      }
      const orderDetails = await AllOrdersRepository.findOneBy({
        orderid: payload.orderid,
      });
      if (!orderDetails?.orderid) {
        throw new ValidationException("Orders not found");
      }
      const { cuid, orderid, ...updatePayload } = payload;
      await AllOrdersRepository.update(
        { orderid: payload.orderid },
        updatePayload
      );
      res.status(200).send({
        IsSuccess: "Orders Details updated SuccessFully",
      });
      return;
    }

    // const existingProduct = await AllOrdersRepository.findOneBy({
    //   title: payload.title,
    // });
    // if (existingProduct) {
    //   throw new ValidationException("Product name already exists");
    // }

    const validation = allOrdersValidation.validate(payload);
    if (validation?.error) {
      throw new ValidationException(validation.error.message);
    }
    const { orderid, ...updatePayload } = payload;
    await AllOrdersRepository.save(updatePayload);
    res.status(200).send({
      IsSuccess: "Orders Details added SuccessFully",
    });
  } catch (error) {
    console.log(error, "error");
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error.message,
      });
    }
    res.status(500).send({ message: "Internal server error" });
  }
};

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
  try {
    const ProductRepository = appSource.getRepository(allOrders);
    if (payload.customerid) {
      const validation = updateAllOrdersValidation.validate(payload);
      if (validation?.error) {
        throw new ValidationException(validation.error.message);
      }
      const productDetails = await ProductRepository.findOneBy({
        customerid: payload.customerid,
      });
      if (!productDetails?.customerid) {
        throw new ValidationException("Product not found");
      }
      const { cuid, customerid, ...updatePayload } = payload;
      await ProductRepository.update(
        { customerid: payload.customerid },
        updatePayload
      );
      res.status(200).send({
        IsSuccess: "Product Details updated SuccessFully",
      });
      return;
    }
    const validation = allOrdersValidation.validate(payload);
    if (validation?.error) {
      throw new ValidationException(validation.error.message);
    }

    const existingProduct = await ProductRepository.findOneBy({
      customer_name: payload.customer_name,
    });
    if (existingProduct) {
      throw new ValidationException("Product name already exists");
    }
    
    const { customerid, ...updatePayload } = payload;
    await ProductRepository.save(updatePayload);
    res.status(200).send({
      IsSuccess: "Product Details added SuccessFully",
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
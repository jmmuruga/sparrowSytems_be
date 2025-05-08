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
    const AllOrdersRepository = appSource.getRepository(allOrders);
    if (payload.orderid) {
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
    const validation = allOrdersValidation.validate(payload);
    if (validation?.error) {
      throw new ValidationException(validation.error.message);
    }

    const { orderItems, orderid, ...commonFields } = payload;

    for (const item of orderItems) {
      const order = new allOrders();
      Object.assign(order, {
        ...commonFields, 
        productid: item.productid,
        product_name: item.product_name,
        quantity: item.quantity,
        offer_price : item.offer_price,
        total_amount: item.offer_price * item.quantity
      });

      await AllOrdersRepository.save(order); // Save each item individually
    }

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

export const getAllOrderDetails = async (req: Request, res: Response) => {
  try {
    const Repository = appSource.getRepository(allOrders);
    const ordersList = await Repository.createQueryBuilder().getMany();

    res.status(200).send({
      Result: ordersList,
    });
  } catch (error) {
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error?.message,
      });
    }
    res.status(500).send(error);
  }
};

import { appSource } from "../../core/db";
import { ValidationException } from "../../core/exception";
import { ordersDto, ordersDtoValidation } from "./orders.dto";
import { orders } from "./orders.model";
import { Request, Response } from "express";

export const addAllOrders = async (req: Request, res: Response) => {
  const payload: ordersDto = req.body;

  try {
    // Validate incoming payload
    const validation = ordersDtoValidation.validate(payload);
    if (validation?.error) {
      throw new ValidationException(validation.error.message);
    }

    const AllOrdersRepository = appSource.getRepository(orders);

    const { orderItems, orderid, ...commonFields } = payload;

    // If updating an existing order
    if (orderid) {
      const existingOrders = await AllOrdersRepository.find({
        where: { orderid },
      });

      if (existingOrders.length === 0) {
        throw new ValidationException("Order not found for update");
      }

      // Delete existing order items (to replace with updated ones)
      await AllOrdersRepository.delete({ orderid });

      // Proceed to insert new ones with the same orderid
    }

    // Create new order items
    for (const item of orderItems) {
      const order = new orders();
      Object.assign(order, {
        orderid,
        ...commonFields,
        productid: item.productid,
        quantity: item.quantity,
        offer_price: item.offer_price,
        total_amount: item.offer_price * item.quantity,
      });

      await AllOrdersRepository.save(order);
    }

    res.status(200).send({
      IsSuccess: orderid
        ? "Order updated successfully"
        : "Order placed successfully",
    });
  } catch (error) {
    console.error(error, "error");
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error.message,
      });
    }
    res.status(500).send({ message: "Internal server error" });
  }
};

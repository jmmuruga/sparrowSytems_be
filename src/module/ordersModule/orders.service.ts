import { appSource } from "../../core/db";
import { HttpException, ValidationException } from "../../core/exception";
import { ordersDto, ordersDtoValidation, orderStatusDto } from "./orders.dto";
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

export const getOrderDetails = async (req: Request, res: Response) => {
  try {
    // const customerid = req.params.customerid;
    // console.log(customerid, "customerid")
    const orderid = req.params.orderid;
    const orderRepository = appSource.getRepository(orders);
    const details: ordersDto[] = await orderRepository.query(
      `  SELECT 
    o.orderid,
    cd.customername,
    o.total_amount,
    o.created_at,
    o.status,
    o.updated_at,
    o.quantity,
    o.offer_price,
    p.product_name,
    c.categoryname AS category
FROM 
    [SPARROW_SYSTEMS].[dbo].[orders] AS o
INNER JOIN 
    [SPARROW_SYSTEMS].[dbo].[products] AS p ON o.productid = p.productid
INNER JOIN 
    [SPARROW_SYSTEMS].[dbo].[category] AS c ON p.category_name = c.categoryid
INNER JOIN 
    [SPARROW_SYSTEMS].[dbo].[customer_details] AS cd ON o.customerid = cd.customerid; `, [orderid]
    );
    res.status(200).send({ Result: details });
  } catch (error) {
    console.log(error);
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error?.message,
      });
    }
    res.status(500).send(error);
  }
};

export const changeOrderStatus = async (req: Request, res: Response) => {
  const status: orderStatusDto = req.body;
  console.log("Received order status update:", status);
  const OrderRepository = appSource.getRepository(orders);
  try {
    const details = await OrderRepository.findOneBy({
      orderid: Number(status.orderid),
    });
    if (!details) throw new HttpException("Order not Found", 400);

    details.status = status.status;
    await OrderRepository.save(details); // Auto-updates `updatedAt` due to @UpdateDateColumn

    res.status(200).send({
      IsSuccess: `Status for order updated successfully!`,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).send(error);
  }
};

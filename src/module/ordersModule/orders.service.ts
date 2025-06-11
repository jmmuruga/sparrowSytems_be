import { appSource } from "../../core/db";
import { HttpException, ValidationException } from "../../core/exception";
import { customerDetails } from "../customerDetails/customerDetails.model";
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

      //upadte the no order count
      const customerRespositary = appSource.getRepository(customerDetails);
      const customerData = await customerRespositary.findOneBy({
        customerid: payload.customerid,
      });
      if (!customerData?.customerid) {
        throw new ValidationException("customer id is not found ");
      }
      const alreadyOrdersCount = customerData.orderCount || 0;
      const updateOrderCount = alreadyOrdersCount + 1;
      await customerRespositary
        .createQueryBuilder()
        .update(customerDetails)
        .set({ orderCount: updateOrderCount })
        .where({ customerid: payload.customerid })
        .execute();
    }

    res.status(200).send({
      IsSuccess: orderid
        ? "Order updated successfully"
        : "Order placed successfully",
    });
  } catch (error) {
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
    o.payment_method,
    o.open_orders_date,
    o.processing_orders_date,
    o.failure_orders_date,
    o.canceled_orders_date,
    o.shipped_orders_date,
    o.closed_orders_date,
    p.delivery_amount,
    o.address_id,
    c.categoryname AS category,
    cd.mobilenumber,
    o.delivery_orders_date,
	  o.return_orders_date,

    CASE 
        WHEN o.address_id IS NULL THEN cd.customeraddress
        ELSE 
            CONCAT(
                ISNULL(ca.door_no, '') + ', ',
                ISNULL(ca.house_name, '') + ', ',
                ISNULL(ca.street_name1, '') + ', ',
                ISNULL(ca.street_name2, '') + ', ', 
                ISNULL(ca.place, '') + ', ',
                ISNULL(ca.post, '') + ', ',
                ISNULL(ca.taluk, '') + ', ',
                ISNULL(ca.district, '') + ', ',
                ISNULL(ca.pincode, '')
            )
    END AS orderAddress
FROM 
    [${process.env.DB_name}].[dbo].[orders] AS o
INNER JOIN 
    [${process.env.DB_name}].[dbo].[products] AS p ON o.productid = p.productid
INNER JOIN 
    [${process.env.DB_name}].[dbo].[category] AS c ON p.category_name = c.categoryid
LEFT JOIN 
    [${process.env.DB_name}].[dbo].[customer_address] AS ca ON o.address_id = ca.id
INNER JOIN 
    [${process.env.DB_name}].[dbo].[customer_details] AS cd ON o.customerid = cd.customerid 
WHERE 
    o.orderid = ${orderid} ; `
    );
    res.status(200).send({ Result: details });
  } catch (error) {
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error?.message,
      });
    }
    res.status(500).send(error);
  }
};

export const changeOrderStatus = async (req: Request, res: Response) => {
  try {
    const status: orderStatusDto = req.body;
    status.status = status.status.toString();
    if (
      !status.orderid ||
      status.status === undefined ||
      status.status === null
    ) {
      throw new HttpException("Invalid order ID or status", 400);
    }

    const OrderRepository = appSource.getRepository(orders);

    const details = await OrderRepository.findOneBy({
      orderid: Number(status.orderid),
    });

    if (!details) {
      throw new HttpException("Order not Found", 404);
    }

    await OrderRepository.createQueryBuilder()
      .update(orders)
      .set({ status: status.status })
      .where({ orderid: Number(status.orderid) })
      .execute();

    if (status.status === "1") {
      await OrderRepository.createQueryBuilder()
        .update(orders)
        .set({ open_orders_date: status.date })
        .where({ orderid: Number(status.orderid) })
        .execute();
    } else if (status.status == "2") {
      await OrderRepository.createQueryBuilder()
        .update(orders)
        .set({ processing_orders_date: status.date })
        .where({ orderid: Number(status.orderid) })
        .execute();
    } else if (status.status == "3") {
      await OrderRepository.createQueryBuilder()
        .update(orders)
        .set({ failure_orders_date: status.date })
        .where({ orderid: Number(status.orderid) })
        .execute();
    } else if (status.status == "4") {
      await OrderRepository.createQueryBuilder()
        .update(orders)
        .set({ canceled_orders_date: status.date })
        .where({ orderid: Number(status.orderid) })
        .execute();
    } else if (status.status == "5") {
      await OrderRepository.createQueryBuilder()
        .update(orders)
        .set({ shipped_orders_date: status.date })
        .where({ orderid: Number(status.orderid) })
        .execute();
    } else if (status.status == "6") {
      await OrderRepository.createQueryBuilder()
        .update(orders)
        .set({ closed_orders_date: status.date })
        .where({ orderid: Number(status.orderid) })
        .execute();
    } else if (status.status == "7") {
      await OrderRepository.createQueryBuilder()
        .update(orders)
        .set({ delivery_orders_date: status.date })
        .where({ orderid: Number(status.orderid) })
        .execute();
    } else if (status.status == "8") {
      await OrderRepository.createQueryBuilder()
        .update(orders)
        .set({ return_orders_date: status.date })
        .where({ orderid: Number(status.orderid) })
        .execute();
    }

    return res.status(200).send({
      IsSuccess: `Status for order updated successfully!`,
    });
  } catch (error: any) {
    return res.status(error.statusCode || 500).send({
      IsSuccess: false,
      Message: error.message || "Something went wrong",
    });
  }
};

export const getAllOrderDetails = async (req: Request, res: Response) => {
  try {
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
    o.payment_method,
    p.product_name,
    p.delivery_amount,
    o.open_orders_date,
	  o.processing_orders_date,
	  o.failure_orders_date,
	  o.canceled_orders_date,
	  o.shipped_orders_date,
	  o.closed_orders_date,
    c.categoryname AS category,
    p.image1,
    o.delivery_orders_date,
    o.customerid
FROM 
    [${process.env.DB_name}].[dbo].[orders] AS o
INNER JOIN 
    [${process.env.DB_name}].[dbo].[products] AS p ON o.productid = p.productid
INNER JOIN 
    [${process.env.DB_name}].[dbo].[category] AS c ON p.category_name = c.categoryid
INNER JOIN 
    [${process.env.DB_name}].[dbo].[customer_details] AS cd ON o.customerid = cd.customerid; `
    );
    res.status(200).send({ Result: details });
  } catch (error) {
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error?.message,
      });
    }
    res.status(500).send(error);
  }
};


export const getOrderDetailsByCustomer = async (req: Request, res: Response) => {
   const  customerid  = req.params.customerid

  try {
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
    o.payment_method,
    p.product_name,
    p.delivery_amount,
    o.open_orders_date,
	  o.processing_orders_date,
	  o.failure_orders_date,
	  o.canceled_orders_date,
	  o.shipped_orders_date,
	  o.closed_orders_date,
    c.categoryname AS category,
    p.image1,
    o.delivery_orders_date,
    o.customerid
FROM 
    [SPARROW_SYSTEMS].[dbo].[orders] AS o
INNER JOIN 
    [SPARROW_SYSTEMS].[dbo].[products] AS p ON o.productid = p.productid
INNER JOIN 
    [SPARROW_SYSTEMS].[dbo].[category] AS c ON p.category_name = c.categoryid
INNER JOIN 
    [SPARROW_SYSTEMS].[dbo].[customer_details] AS cd ON o.customerid = cd.customerid
    WHERE 
    o.customerid = ${customerid}; `
    );
    res.status(200).send({ Result: details });
  } catch (error) {
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error?.message,
      });
    }
    res.status(500).send(error);
  }
};




export const getOrderId = async (req: Request, res: Response) => {
  try {
    const orderRepoistry = appSource.getRepository(orders);
    const orderDetails = await orderRepoistry.query(
      `SELECT orderid
            FROM [${process.env.DB_name}].[dbo].[orders]
            Group by orderid
            ORDER BY CAST(orderid AS INT) DESC;`
    );
    let id = 0;
    if (orderDetails?.length > 0) {
      id = orderDetails[0].orderid;
    }
    res.status(200).send({
      Result: id + 1,
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

export const getLatestOrders = async (req: Request, res: Response) => {
  try {
    const orderRepository = appSource.getRepository(orders);
    const details: ordersDto[] = await orderRepository.query(
      `SELECT TOP 10
    o.orderid,
    cd.customername,
    o.total_amount,
    o.created_at,
    o.status
  FROM 
    [${process.env.DB_name}].[dbo].[orders] AS o
  INNER JOIN 
    [${process.env.DB_name}].[dbo].[customer_details] AS cd 
     ON o.customerid = cd.customerid 
  ORDER BY 
    o.updated_at DESC;`
    );
    res.status(200).send({ Result: details });
  } catch (error) {
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error?.message,
      });
    }
    res.status(500).send(error);
  }
};

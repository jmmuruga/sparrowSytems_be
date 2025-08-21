import { appSource } from "../../core/db";
import { HttpException, ValidationException } from "../../core/exception";
import { customerDetails } from "../customerDetails/customerDetails.model";
import { LogsDto } from "../logs/logs.dto";
import { InsertLog } from "../logs/logs.service";
import { products } from "../productModule/product.model";
import { ordersDto, ordersDtoValidation, orderStatusDto } from "./orders.dto";
import { orders } from "./orders.model";
import { Request, Response } from "express";
import nodemailer from "nodemailer";

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

        const productRepository = appSource.getRepository(products)
  const productNameDetails =  await productRepository.findOneBy({
    productid: item.productid,
  })
      
        const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: false,
      auth: {
        user: "savedatain@gmail.com",
        pass: "unpk bcsy ibhp wzrm",
      },
    });


      let response = await transporter.sendMail({
      from: "savedatain@gmail.com",
      to: customerData?.email,
      subject: `Update on Your Order #${orderid}`,
      text: `Hello ${customerData.customername || "Customer"},\n\nYour order has been placed successfully.\n\nProduct: ${productNameDetails?.product_name}\n\nThank you for shopping with us!\n\n`,
    });

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
  const customerRepoistry = appSource.getRepository(customerDetails);

  const OrderedcustomerDetails = await customerRepoistry.findOneBy({
    customerid: details?.customerid,
  });

  const productRepository = appSource.getRepository(products)
  const productNameDetails =  await productRepository.findOneBy({
    productid: details?.productid,
  })

  if (!details) {
    throw new HttpException("Order not Found", 404);
  }

  try {
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

    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: false,
      auth: {
        user: "savedatain@gmail.com",
        pass: "unpk bcsy ibhp wzrm",
      },
    });

    const statusMessages: Record<string, string> = {
      "1": "Order Opened",
      "2": "Order is Processing",
      "3": "Order Failed",
      "4": "Order Cancelled",
      "5": "Order Shipped",
      "6": "Order Closed",
      "7": "Order Delivered",
      "8": "Order Returned",
    };


const readableStatus = statusMessages[status.status] || "Order Updated"

 const formattedDate = new Date(status.date).toLocaleString("en-IN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  
});

    let response = await transporter.sendMail({
      from: "savedatain@gmail.com",
      to: OrderedcustomerDetails?.email,
      subject: `Product:${productNameDetails?.product_name}Update on Your Order #${details?.orderid} - ${readableStatus}`,
      text: `Product: ${details?.orderid} Date: ${formattedDate} Current Status: ${readableStatus}}`,
    });

    const logsPayload: LogsDto = {
      userId: Number(status.userId),
      userName: "",
      statusCode: 200,
      message: `Order Status id of ${details.orderid} status changed to ${status.status} by -`,
    };
    await InsertLog(logsPayload);

    return res.status(200).send({
      IsSuccess: `Status for order updated successfully!`,
    });
  } catch (error: any) {
    const logsPayload: LogsDto = {
      userId: Number(status.userId),
      userName: "",
      statusCode: 500,
      message: `Error while changing status for Order id of ${details.orderid}  to ${status.status} by -`,
    };
    await InsertLog(logsPayload);
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
      ` SELECT 
    o.orderid,
    cd.customername,
    o.total_amount,
    o.created_at,
    o.status,
    o.updated_at,
    o.quantity,
    o.offer_price,
    o.payment_method,
    p.productid,
    p.delivery_amount,
    o.open_orders_date,
	  o.processing_orders_date,
	  o.failure_orders_date,
	  o.canceled_orders_date,
	  o.shipped_orders_date,
	  o.closed_orders_date,
    o.delivery_orders_date,
    o.customerid,
    p.product_name,
	pn.image 
FROM 
    [${process.env.DB_name}].[dbo].[orders] AS o
INNER JOIN 
    [${process.env.DB_name}].[dbo].[products] AS p ON o.productid = p.productid
INNER JOIN 
    [${process.env.DB_name}].[dbo].[customer_details] AS cd ON o.customerid = cd.customerid
	OUTER APPLY (
    SELECT TOP 1 pn.image
    FROM [${process.env.DB_name}].[dbo].[product_nested] AS pn
    WHERE pn.productid = p.productid
    ORDER BY pn.id ASC  
) AS pn;`
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

export const getOrderDetailsByCustomer = async (
  req: Request,
  res: Response
) => {
  const customerid = req.params.customerid;

  try {
    const orderRepository = appSource.getRepository(orders);
    const details: ordersDto[] = await orderRepository.query(
      ` SELECT
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
    o.delivery_orders_date,
    o.customerid,
    pn.image AS image1  -- :white_check_mark: First product image
FROM
    [${process.env.DB_name}].[dbo].[orders] AS o
INNER JOIN
    [${process.env.DB_name}].[dbo].[products] AS p ON o.productid = p.productid
INNER JOIN
    [${process.env.DB_name}].[dbo].[customer_details] AS cd ON o.customerid = cd.customerid
OUTER APPLY (
    SELECT TOP 1 image
    FROM [${process.env.DB_name}].[dbo].[product_nested] AS pn
    WHERE pn.productid = p.productid
    ORDER BY pn.id ASC
) AS pn
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
      `SELECT 
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

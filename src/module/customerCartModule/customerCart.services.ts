import { Request, Response } from "express";
import { appSource } from "../../core/db";
import { CustomerCartDto, CustomerCartValidation } from "./customerCart.dto";
import { ValidationException } from "../../core/exception";
import { CustomerCart } from "./customerCart.model";

export const addCustomerCart = async (req: Request, res: Response) => {
  try {
    const payload: CustomerCartDto = req.body;
    const validation = CustomerCartValidation.validate(payload);
    if (validation?.error) {
      throw new ValidationException(validation.error.message);
    }

    const cartRepository = appSource.getRepository(CustomerCart);

    // Check if this customer already has this product in their cart
    const existing = await cartRepository.findOne({
      where: {
        customerid: payload.customerid,
        productid: payload.productid,
      },
    });

    if (existing) {
      // Update existing quantity
      existing.quantity = payload.quantity;
      await cartRepository.save(existing);
    } else {
      // Insert new row
      await cartRepository.save(payload);
    }

    res.status(200).send({
      IsSuccess: "MyCart updated successfully",
    });
  } catch (error) {
    if (error instanceof ValidationException) {
      return res.status(400).send({ message: error.message });
    }
    res.status(500).send({ message: "Internal server error" });
  }
};

export const removeCustomerCart = async (req: Request, res: Response) => {
  try {
    const customerid = parseInt(req.query.customerid as string, 10);
    const productid = parseInt(req.query.productid as string, 10);

    if (isNaN(customerid) || isNaN(productid)) {
      return res.status(400).send({ message: "Invalid customerid or productid" });
    }

    const cartRepository = appSource.getRepository(CustomerCart);
    await cartRepository.delete({ customerid, productid });

    res.status(200).send({ message: "Product removed from cart" });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};

// export const getCustomerCartDetails = async (req: Request, res: Response) => {
//   try {
//     const customerid = req.params.customerid
//     const cartRepository = appSource.getRepository(CustomerCart);
//     const details: CustomerCartDto[] = await cartRepository.query(
//       `SELECT 
//     cc.productid,
//     cc.customerid,
//     cc.quantity,
//     p.product_name,
//     p.image1,
//     p.offer_price
// FROM 
//     [${process.env.DB_name}].[dbo].[customer_cart] AS cc
// INNER JOIN 
//     [${process.env.DB_name}].[dbo].[products] AS p
//     ON cc.productid = p.productid
//     where cc.customerid = '${customerid}'`
//     );
//     res.status(200).send({ Result: details });
//   } catch (error) {
//     if (error instanceof ValidationException) {
//       return res.status(400).send({
//         message: error?.message,
//       });
//     }
//     res.status(500).send(error);
//   }
// };

export const getCustomerCartDetails = async (req: Request, res: Response) => {
  try {
    const customerid = req.params.customerid
    const cartRepository = appSource.getRepository(CustomerCart);
    const details: CustomerCartDto[] = await cartRepository.query(
      `SELECT 
    cc.productid,
    cc.customerid,
    cc.quantity,
    p.product_name,
    p.mrp,
    p.discount,
    p.delivery_amount,
    p.offer_price,
    pn.image AS top_image
FROM 
    [SPARROW_SYSTEMS].[dbo].[customer_cart] AS cc
INNER JOIN 
    [SPARROW_SYSTEMS].[dbo].[products] AS p
    ON cc.productid = p.productid
OUTER APPLY (
    SELECT TOP 1 pn.image
    FROM [SPARROW_SYSTEMS].[dbo].[product_nested] AS pn
    WHERE pn.productid = p.productid
    ORDER BY pn.id ASC  
) AS pn
WHERE 
    cc.customerid = '${customerid}'`
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

export const clearCustomerCart = async (req: Request, res: Response) => {
  try {
    const customerid = parseInt(req.params.customerid, 10);

    if (isNaN(customerid)) {
      return res.status(400).send({ message: "Invalid customerid" });
    }

    const cartRepository = appSource.getRepository(CustomerCart);

    // Double check and delete only entries matching the exact customerid
    const deleted = await cartRepository
      .createQueryBuilder()
      .delete()
      .from(CustomerCart)
      .where("customerid = :customerid", { customerid })
      .execute();

    res.status(200).send({ message: "Customer cart cleared", deletedCount: deleted.affected });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};



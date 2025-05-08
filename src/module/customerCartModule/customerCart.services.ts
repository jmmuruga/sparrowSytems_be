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
    console.error(error, "error");
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
    console.error("Error removing product:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};



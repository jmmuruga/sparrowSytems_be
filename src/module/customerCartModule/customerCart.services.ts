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
    await cartRepository.save(payload);

    res.status(200).send({
      IsSuccess: "MyCart added successfully",
    });
  } catch (error) {
    console.error(error, "error");
    if (error instanceof ValidationException) {
      return res.status(400).send({ message: error.message });
    }
    res.status(500).send({ message: "Internal server error" });
  }
};

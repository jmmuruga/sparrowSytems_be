import { Request, Response } from "express";
import { HttpException, ValidationException } from "../../core/exception";
import { appSource } from "../../core/db";
import {
  customerAddressDto,
  customerAddressValiadtion,
} from "./customerAddress.dto";
import { customerAddress } from "./customerAddress.model";
import { customerDetailsValiadtion } from "../customerDetails/customerDetails.dto";
import { customerDetails } from "../customerDetails/customerDetails.model";

export const AddNewAddres = async (req: Request, res: Response) => {
  const payload: customerAddressDto = req.body;

  try {
    const CustomerAddressRepositary = appSource.getRepository(customerAddress);
    const validation = customerAddressValiadtion.validate(payload);
    if (validation?.error) {
      throw new ValidationException(validation.error.message);
    }

    const { id, ...customer } = payload;
    await CustomerAddressRepositary.save(customer);
    res.status(200).send({
      IsSuccess: "customer Details added SuccessFully",
    });
  } catch (error) {
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error.message, // Ensure the error message is sent properly
      });
    }
    res.status(500).send({ message: "Internal server error" });
  }
};

export const getAddress = async (req: Request, res: Response) => {
  const { customerid } = req.params;
  try {
    const addressRespositary = appSource.getRepository(customerAddress);

    const result = await addressRespositary.findBy({
      customerid: Number(customerid),
    });

    res.status(200).send({
      IsSuccess: "customer Details added SuccessFully",
      Result:result,
    });
  } catch (error) {
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error.message, // Ensure the error message is sent properly
      });
    }
    res.status(500).send({ message: "Internal server error" });
  }
};

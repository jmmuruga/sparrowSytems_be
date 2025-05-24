import { appSource } from "../../core/db";
import { HttpException, ValidationException } from "../../core/exception";
import { Request, Response } from "express";
import { courier } from "./courier.model";
import { CourierUpdateValidate, CourierValidate } from "./courier.dto";

export const addCourier = async (req: Request, res: Response) => {
  const payload: courier = req.body;
  try {
    const Repository = appSource.getRepository(courier);

    if (payload.courier_id) {
      const validation = CourierUpdateValidate.validate(payload);
      if (validation?.error) {
        throw new ValidationException(validation.error.message);
      }
      const Details = await Repository.findOneBy({
        courier_id: payload.courier_id,
      });
      if (!Details?.courier_id) {
        throw new ValidationException("id not found");
      }
      const { cuid, courier_id, ...updatePayload } = payload;
      await Repository.update({  courier_id: payload.courier_id }, updatePayload);
      res.status(200).send({
        IsSuccess: " courier updated SuccessFully",
      });
      return;
    }
    const validation = CourierValidate.validate(payload);
    if (validation?.error) {
      throw new ValidationException(validation.error.message);
    }

    const {  courier_id, ...updatePayload } = payload;
    await Repository.save(updatePayload);
    res.status(200).send({
      IsSuccess: " Courier added SuccessFully",
    });
  } catch (error) {
    console.log("error", error);
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error.message,
      });
    }
    res.status(500).send({ message: "Internal server error" });
  }
};

export const getCourier = async (req: Request, res: Response) => {
  try {
    const Repository = appSource.getRepository(courier);

    const Data = await Repository.createQueryBuilder().getMany();
    res.status(200).send({
      Result: Data,
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


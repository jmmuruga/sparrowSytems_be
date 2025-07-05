import { appSource } from "../../core/db";
import { HttpException, ValidationException } from "../../core/exception";
import { Request, Response } from "express";
import { productColorVariation } from "./productColorVariation.model";
import {
  productColorVariationDto,
  productColorVariationValidate,
} from "./productColorVariation.dto";

export const addImageColour = async (req: Request, res: Response) => {
  const payload: productColorVariationDto = req.body;
  console.log(req.body,)
  try {
    const Repository = appSource.getRepository(productColorVariation);
    const validation = productColorVariationValidate.validate(payload);
    if (validation?.error) {
      throw new ValidationException(validation.error.message);
    }
    const { id, cuid,imageid, ...insertdata } = payload;
    await Repository.save(insertdata);
  } catch (error) {
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error.message,
      });
    }
    res.status(500).send({ message: "Internal server error" });
  }
};

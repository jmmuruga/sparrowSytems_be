import { appSource } from "../../core/db";
import { HttpException, ValidationException } from "../../core/exception";
import { Request, Response } from "express";
import { currentOpeningsDto, currentOpeningsUpdateValidation, currentOpeningsValidation } from "./currentOpenings.dto";
import { currentOpenings } from "./currentOpenings.model";

export const addOpenings = async (req: Request, res: Response) => {
  const payload: currentOpeningsDto = req.body;
  console.log("payload", payload);
  try {
    const Repository = appSource.getRepository(currentOpenings);

    if (payload.id) {
      const validation = currentOpeningsUpdateValidation.validate(payload);
      if (validation?.error) {
        throw new ValidationException(validation.error.message);
      }
      const Details = await Repository.findOneBy({
        id: payload.id,
      });
      if (!Details?.id) {
        throw new ValidationException("id not found");
      }
      const { cuid, id, ...updatePayload } = payload;
      await Repository.update({ id: payload.id }, updatePayload);
      res.status(200).send({
        IsSuccess: " Details updated SuccessFully",
      });
      return;
    }
    const validation = currentOpeningsValidation.validate(payload);
    if (validation?.error) {
      throw new ValidationException(validation.error.message);
    }
    
    const { id, ...updatePayload } = payload;
    await  Repository.save(updatePayload);
    res.status(200).send({
      IsSuccess: " Details added SuccessFully",
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

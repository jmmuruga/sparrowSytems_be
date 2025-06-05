import { appSource } from "../../core/db";
import { Request, Response } from "express";
import { GetInTouchDto, getInTouchDtoValidation, updateGetInTouchValidation } from "./getInTouch.dto";
import { GetInTouch } from "./getInTouch.model";
import { ValidationException } from "../../core/exception";


export const addGetInTouch = async (req: Request, res: Response) => {
    const payload: GetInTouchDto = req.body;
    const getInTouchRepository = appSource.getRepository(GetInTouch);
    try {
        if (payload.id) {
            const updateError  = updateGetInTouchValidation.validate(payload);
            if (updateError.error) {
                throw new ValidationException(updateError.error.message);
            }

            const existingSettings = await getInTouchRepository.findOneBy({ id: payload.id });
            if (!existingSettings) {
                throw new ValidationException("Button settings not found");
            }

            const { id, ...updatePayload } = payload;
            await getInTouchRepository.update({ id }, updatePayload);

            return res.status(200).send({
                message: "Button settings updated successfully",
            });
        }

        // add new
        const  validation  = getInTouchDtoValidation.validate(payload);
        if (validation.error) {
            throw new ValidationException(validation.error.message);
        }

        await getInTouchRepository.save(payload)

        return res.status(200).send({
            message: "Button settings added successfully",
        });

    } catch (error) {
        if (error instanceof ValidationException) {
            return res.status(400).send({
                message: error.message,
            });
        }
        return res.status(500).send({
            message: "Internal server error",
        });
    }
};

export const getButtonDetails = async (req: Request, res: Response) => {
  try {
    const Repository = appSource.getRepository(GetInTouch);
    const newButtonList = await Repository.createQueryBuilder().getMany();

    res.status(200).send({
      Result: newButtonList,
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
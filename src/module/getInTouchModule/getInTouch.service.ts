import { appSource } from "../../core/db";
import { Request, Response } from "express";
import { GetInTouchDto, getInTouchDtoValidation, updateGetInTouchValidation } from "./getInTouch.dto";
import { GetInTouch } from "./getInTouch.model";
import { ValidationException } from "../../core/exception";
import { LogsDto } from "../logs/logs.dto";
import { InsertLog } from "../logs/logs.service";

export const addGetInTouch = async (req: Request, res: Response) => {
  const payload: GetInTouchDto = req.body;
  const getInTouchRepository = appSource.getRepository(GetInTouch);
  const userId = payload.id ? payload.muid : payload.cuid;

  try {
    if (payload.id) {
      const updateError = updateGetInTouchValidation.validate(payload);
      if (updateError.error) {
        throw new ValidationException(updateError.error.message);
      }

      const existingSettings = await getInTouchRepository.findOneBy({ id: payload.id });
      if (!existingSettings) {
        throw new ValidationException("Button settings not found");
      }

      const { id, ...updatePayload } = payload;
      await getInTouchRepository.update({ id }, updatePayload);
      const logsPayload: LogsDto = {
        userId: userId,
        userName: '',
        statusCode: 200,
        message: `Get In Touch ${payload.button_name} updated by -`
      }
      await InsertLog(logsPayload);
      return res.status(200).send({
        message: "Button settings updated successfully",
      });
    }

    // add new
    const validation = getInTouchDtoValidation.validate(payload);
    if (validation.error) {
      throw new ValidationException(validation.error.message);
    }

    await getInTouchRepository.save(payload);
    const logsPayload: LogsDto = {
      userId: userId,
      userName: '',
      statusCode: 200,
      message: `Get In Touch ${payload.button_name} added by -`
    }
    await InsertLog(logsPayload);

    return res.status(200).send({
      message: "Button settings added successfully",
    });

  } catch (error) {
    const logsPayload: LogsDto = {
      userId: userId,
      userName: '',
      statusCode: 500,
      message: `Error while saving Get In Touch ${payload.button_name} by -`
    }
    await InsertLog(logsPayload);
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
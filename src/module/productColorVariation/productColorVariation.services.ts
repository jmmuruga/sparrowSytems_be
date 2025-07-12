import { appSource } from "../../core/db";
import { HttpException, ValidationException } from "../../core/exception";
import { Request, Response } from "express";
import { productColorVariation } from "./productColorVariation.model";
import {
  productColorUpadteVariationValidate,
  productColorVariationDto,
  productColorVariationValidate,
} from "./productColorVariation.dto";
import { report } from "node:process";
import { LogsDto } from "../logs/logs.dto";
import { InsertLog } from "../logs/logs.service";

export const addImageColour = async (req: Request, res: Response) => {
  const payload: productColorVariationDto = req.body;
  const userId = payload.id ? payload.muid : payload.cuid;
  try {
    const Repository = appSource.getRepository(productColorVariation);
    if (payload.id) {
      const validation = productColorUpadteVariationValidate.validate(payload);
      if (validation?.error) {
        throw new ValidationException(validation.error.message);
      }
      const colourVariation = await Repository.findOneBy({ id: payload.id });
      if (!colourVariation?.id) {
        throw new ValidationException("id  not found");
      }

      const { cuid, id, ...updatePayload } = payload;
      await Repository.update({ id: payload.id }, updatePayload);
      const logsPayload: LogsDto = {
        userId: userId,
        userName: '',
        statusCode: 200,
        message: `Product color variations ${payload.colour} updated by -`
      }
      await InsertLog(logsPayload);
      res.status(200).send({
        IsSuccess: "product colour  updated SuccessFully",
      });
      return;
    }

    const validation = productColorVariationValidate.validate(payload);
    if (validation?.error) {
      throw new ValidationException(validation.error.message);
    }

    const { id, ...insertdata } = payload;
    await Repository.save(insertdata);
    const logsPayload: LogsDto = {
      userId: userId,
      userName: '',
      statusCode: 200,
      message: `Product color variation ${payload.colour} added by -`
    }
    await InsertLog(logsPayload);
    res.status(200).send({
      IsSuccess: "product colour added SuccessFully",
    });
    return;
  } catch (error) {
    const logsPayload: LogsDto = {
      userId: userId,
      userName: '',
      statusCode: 500,
      message: `Error while saving Product color variation ${payload.colour} by -`
    }
    await InsertLog(logsPayload);
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error.message,
      });
    }
    res.status(500).send({ message: "Internal server error" });
  }
};

export const getcolourVariationData = async (req: Request, res: Response) => {
  try {
    const Repository = appSource.getRepository(productColorVariation);
    const getcolour = await Repository.createQueryBuilder().getMany();
    res.status(200).send({
      Result: getcolour,
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

export const deleteColour = async (req: Request, res: Response) => {
  const id = req.params.id;
  const userId = Number(req.params.userId);
  const colourVariationRepo = appSource.getRepository(productColorVariation);
  const deleteData = await colourVariationRepo
    .createQueryBuilder("productColorVariation")
    .where("productColorVariation.id =:id", {
      id: id,
    })
    .getOne();
  if (!deleteData?.id) {
    throw new HttpException("id not found", 404);
  }
  try {
    await colourVariationRepo
      .createQueryBuilder("productColorVariation")
      .delete()
      .from(productColorVariation)
      .where("id=:id", { id: id })
      .execute();

    const logsPayload: LogsDto = {
      userId: userId,
      userName: '',
      statusCode: 200,
      message: `Product color variation ${deleteData.colour} deleted by -`
    }
    await InsertLog(logsPayload);
    res.status(200).send({
      IsSuccess: `id ${id} deleted successfully!`,
    });
  } catch (error) {
    const logsPayload: LogsDto = {
      userId: userId,
      userName: '',
      statusCode: 500,
      message: `Error while deleting Product color variation ${deleteData.colour}  by -`
    }
    await InsertLog(logsPayload);
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error?.message,
      });
    }
    res.status(500).send(error);
  }
};

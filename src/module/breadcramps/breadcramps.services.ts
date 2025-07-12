import { appSource } from "../../core/db";
import { HttpException, ValidationException } from "../../core/exception";
import { Request, Response } from "express";
import {
  breadcrampsDto,
  breadcrampsValidation,
  updateBreadcrampsValidation,
} from "./breadcramps.dto";
import { breadCramps } from "./breadcramps.model";
import { LogsDto } from "../logs/logs.dto";
import { InsertLog } from "../logs/logs.service";

export const addData = async (req: Request, res: Response) => {
  const payload: breadcrampsDto = req.body;
  const userId = payload.id ? payload.muid : payload.cuid;
  try {
    const Repository = appSource.getRepository(breadCramps);

    if (payload.id) {
      const validation = updateBreadcrampsValidation.validate(payload);
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
      const logsPayload: LogsDto = {
        userId: userId,
        userName: '',
        statusCode: 200,
        message: `BreadCamp ${payload.Title} updated by -`
      }
      await InsertLog(logsPayload);
      return;
    }
    const validation = breadcrampsValidation.validate(payload);
    if (validation?.error) {
      throw new ValidationException(validation.error.message);
    }

    const { id, ...updatePayload } = payload;
    await Repository.save(updatePayload);
    const logsPayload: LogsDto = {
      userId: userId,
      userName: '',
      statusCode: 200,
      message: `BreadCamp ${payload.Title} added by -`
    }
    await InsertLog(logsPayload);

    res.status(200).send({
      IsSuccess: " Details added SuccessFully",
    });
  } catch (error) {
    const logsPayload: LogsDto = {
      userId: userId,
      userName: '',
      statusCode: 500,
      message: `Error while saving BreadCamp ${payload.Title} by -`
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

export const getDetail = async (req: Request, res: Response) => {
  try {
    const Repository = appSource.getRepository(breadCramps);

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

export const deleteDetail = async (req: Request, res: Response) => {
  const id = req.params.id;
  const userId = Number(req.params.userId);
  const Repo = appSource.getRepository(breadCramps);
  const deleteUser = await Repo.createQueryBuilder("breadCramps")
    .where("breadCramps.id = :id", {
      id: id,
    })
    .getOne();
  if (!deleteUser?.id) {
    throw new HttpException("id not Found", 404);
  }

  try {
    await Repo.createQueryBuilder("breadCramps")
      .delete()
      .from(breadCramps)
      .where("id = :id", { id: id })
      .execute();

    const logsPayload: LogsDto = {
      userId: userId,
      userName: '',
      statusCode: 200,
      message: `BreadCamp ${deleteUser.Title} deleted by -`
    }
    await InsertLog(logsPayload);

    res.status(200).send({
      IsSuccess: `id  deleted successfully!`,
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

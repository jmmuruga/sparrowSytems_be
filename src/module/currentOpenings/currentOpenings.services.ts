import { appSource } from "../../core/db";
import { HttpException, ValidationException } from "../../core/exception";
import { Request, Response } from "express";
import {
  changeCurrentOpeniingstatusDto,
  currentOpeningsDto,
  currentOpeningsUpdateValidation,
  currentOpeningsValidation,
} from "./currentOpenings.dto";
import { currentOpenings } from "./currentOpenings.model";
import { LogsDto } from "../logs/logs.dto";
import { InsertLog } from "../logs/logs.service";

export const addOpenings = async (req: Request, res: Response) => {
  const payload: currentOpeningsDto = req.body;
  const userId = payload.id ? payload.muid : payload.cuid;
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
      const logsPayload: LogsDto = {
        userId: userId,
        userName: '',
        statusCode: 200,
        message: `Job details ${payload.JobName} updated by -`
      }
      await InsertLog(logsPayload);
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
    await Repository.save(updatePayload);
    const logsPayload: LogsDto = {
      userId: userId,
      userName: '',
      statusCode: 200,
      message: `Job details ${payload.JobName} added by -`
    }
    await InsertLog(logsPayload);
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

export const getOpenings = async (req: Request, res: Response) => {
  try {
    const Repository = appSource.getRepository(currentOpenings);

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

export const changeStatus = async (req: Request, res: Response) => {
  const openingStatus: changeCurrentOpeniingstatusDto = req.body;
  const currentOpeningsRepo = appSource.getRepository(currentOpenings);
  const typeNameFromDb = await currentOpeningsRepo.findBy({
    id: openingStatus.id,
  });

  if (typeNameFromDb?.length == 0) {
    throw new HttpException("Data not Found", 400);
  }
  try {

    await currentOpeningsRepo
      .createQueryBuilder()
      .update(currentOpenings)
      .set({ status: openingStatus.status })
      .where("id = :id", { id: openingStatus.id })
      .execute();

    const logsPayload: LogsDto = {
      userId: Number(openingStatus.userId),
      userName: '',
      statusCode: 200,
      message: `Job details ${typeNameFromDb[0].JobName} status changed to ${openingStatus.status} by -`
    }
    await InsertLog(logsPayload);

    res.status(200).send({
      IsSuccess: `Status Updated successfully!`,
    });
  } catch (error) {
    const logsPayload: LogsDto = {
      userId: Number(openingStatus.userId),
      userName: '',
      statusCode: 500,
      message: `Error while changing status for Job details ${typeNameFromDb[0].JobName}  to ${openingStatus.status} by -`
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

export const deleteOpenings = async (req: Request, res: Response) => {
  const id = req.params.id;
  const userId = Number(req.params.userId);
  const Repo = appSource.getRepository(currentOpenings);
  const deleteUser = await Repo.createQueryBuilder("currentOpenings")
    .where("currentOpenings.id = :id", {
      id: id,
    })
    .getOne();
  if (!deleteUser?.id) {
    throw new HttpException("id not Found", 400);
  }
  try {

    await Repo.createQueryBuilder("currentOpenings")
      .delete()
      .from(currentOpenings)
      .where("id = :id", { id: id })
      .execute();

    const logsPayload: LogsDto = {
      userId: userId,
      userName: '',
      statusCode: 200,
      message: `job details ${deleteUser.JobName} deleted by -`
    }
    await InsertLog(logsPayload);
    res.status(200).send({
      IsSuccess: `id  deleted successfully!`,
    });
  } catch (error) {
    const logsPayload: LogsDto = {
      userId: userId,
      userName: '',
      statusCode: 500,
      message: `Error while deleting Job details ${deleteUser.JobName}  by -`
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

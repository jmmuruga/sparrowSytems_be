import { appSource } from "../../core/db";
import { HttpException, ValidationException } from "../../core/exception";
import { Request, Response } from "express";
import { courier } from "./courier.model";
import { changecourierStatusDto, CourierUpdateValidate, CourierValidate } from "./courier.dto";
import { LogsDto } from "../logs/logs.dto";
import { InsertLog } from "../logs/logs.service";

export const addCourier = async (req: Request, res: Response) => {
  const payload: courier = req.body;
  const userId = payload.courier_id ? payload.muid : payload.cuid;
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
      await Repository.update(
        { courier_id: payload.courier_id },
        updatePayload
      );
      const logsPayload: LogsDto = {
        userId: userId,
        userName: '',
        statusCode: 200,
        message: `courier ${payload.courier_id} updated by -`
      }
      await InsertLog(logsPayload);
      res.status(200).send({
        IsSuccess: " courier updated SuccessFully",
      });
      return;
    }
    const validation = CourierValidate.validate(payload);
    if (validation?.error) {
      throw new ValidationException(validation.error.message);
    }

    const { courier_id, ...updatePayload } = payload;
    await Repository.save(updatePayload);
    const logsPayload: LogsDto = {
      userId: userId,
      userName: '',
      statusCode: 200,
      message: `Courier ${payload.Courier_Name} added by -`
    }
    await InsertLog(logsPayload);
    res.status(200).send({
      IsSuccess: " Courier added SuccessFully",
    });
  } catch (error) {
    const logsPayload: LogsDto = {
      userId: userId,
      userName: '',
      statusCode: 500,
      message: `Error while saving Courier ${payload.Courier_Name} by -`
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

export const courierStatus = async (req: Request, res: Response) => {
  const CourierStatus: changecourierStatusDto = req.body;
  const courierRepo = appSource.getRepository(courier);
  const typeNameFromDb = await courierRepo.findBy({
    courier_id: CourierStatus.courier_id
  })

  if (typeNameFromDb?.length == 0) {
    throw new HttpException("Data not Found", 404);
  }

  try {
    await courierRepo
      .createQueryBuilder()
      .update(courier)
      .set({ status: CourierStatus.status })
      .where("courier_id = :courier_id", { courier_id: CourierStatus.courier_id })
      .execute();

    const logsPayload: LogsDto = {
      userId: Number(CourierStatus.userId),
      userName: '',
      statusCode: 200,
      message: `Courier ${typeNameFromDb[0].Courier_Name} status changed to ${CourierStatus.status} by -`
    }
    await InsertLog(logsPayload);

    res.status(200).send({
      IsSuccess: `Status Updated successfully!`,
    });
  } catch (error) {
    const logsPayload: LogsDto = {
      userId: Number(CourierStatus.userId),
      userName: '',
      statusCode: 500,
      message: `Error while changing status for Courier ${typeNameFromDb[0].Courier_Name}  to ${CourierStatus.status} by -`
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

export const deletecourierDetails = async (req: Request, res: Response) => {
  const id = req.params.id;
  const userId = Number(req.params.userId);
  const Repo = appSource.getRepository(courier);
  const deleteUser = await Repo.createQueryBuilder("courier")
    .where("courier.courier_id = :id", {
      id: id,
    })
    .getOne();
  if (!deleteUser?.courier_id) {
    throw new HttpException("id not Found", 400);
  }

  try {
    await Repo.createQueryBuilder("courier")
      .delete()
      .from(courier)
      .where("courier_id = :id", { id: id })
      .execute();

    const logsPayload: LogsDto = {
      userId: userId,
      userName: '',
      statusCode: 200,
      message: `Courier ${deleteUser.Courier_Name} deleted by -`
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

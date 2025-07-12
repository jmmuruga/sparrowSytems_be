import { Request, Response } from "express";
import {
  bannerDetailsDto,
  bannerDetailsValidation,
  bannerStatusDto,
  updateBannerValidation,
} from "./banner.dto";
import { HttpException, ValidationException } from "../../core/exception";
import { appSource } from "../../core/db";
import { banner } from "./banner.model";
import { Not } from "typeorm";
import { LogsDto } from "../logs/logs.dto";
import { InsertLog } from "../logs/logs.service";

export const newBanner = async (req: Request, res: Response) => {
  const payload: bannerDetailsDto = req.body;
  const userId = payload.bannerid ? payload.muid : payload.cuid;
  try {
    const BannerRepository = appSource.getRepository(banner);
    if (payload.bannerid) {
      const validation = updateBannerValidation.validate(payload);
      if (validation?.error) {
        throw new ValidationException(validation.error.message);
      }
      const bannerDetails = await BannerRepository.findOneBy({
        bannerid: payload.bannerid,
      });
      if (!bannerDetails?.bannerid) {
        throw new ValidationException("banner not found");
      }

      const existingProduct = await BannerRepository.findOne({
        where: {
          title: payload.title,
          bannerid: Not(payload.bannerid),
        },
      });

      if (existingProduct) {
        throw new ValidationException("Product name already exists");
      }

      const { cuid, bannerid, ...updatePayload } = payload;
      const logsPayload: LogsDto = {
        userId: userId,
        userName: '',
        statusCode: 200,
        message: `Banner ${payload.title} updated by -`
      }
      await InsertLog(logsPayload);

      // Safe conversion from "true"/"false"/true/false to boolean
      updatePayload.status = String(payload.status).toLowerCase() === "true";
      await BannerRepository.update(
        { bannerid: payload.bannerid },
        updatePayload
      );
      res.status(200).send({
        IsSuccess: "banner Details updated SuccessFully",
      });
      return;
    }

    const existingProduct = await BannerRepository.findOneBy({
      title: payload.title,
    });
    if (existingProduct) {
      throw new ValidationException("Product name already exists");
    }

    const validation = bannerDetailsValidation.validate(payload);
    if (validation?.error) {
      throw new ValidationException(validation.error.message);
    }
    const { bannerid, ...updatePayload } = payload;

    const logsPayload: LogsDto = {
      userId: userId,
      userName: '',
      statusCode: 200,
      message: `Banner ${payload.title} added by -`
    }
    await InsertLog(logsPayload);

    updatePayload.status = Boolean(updatePayload.status)
    await BannerRepository.save(updatePayload);
    res.status(200).send({
      IsSuccess: "banner Details added SuccessFully",
    });
  } catch (error) {
    const logsPayload: LogsDto = {
      userId: userId,
      userName: '',
      statusCode: 500,
      message: `Error while saving Banner ${payload.title} by -`
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

export const getBannerDetail = async (req: Request, res: Response) => {
  try {
    const Repository = appSource.getRepository(banner);
    const bannerList = await Repository.createQueryBuilder().getMany();

    res.status(200).send({
      Result: bannerList,
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

export const deleteBanner = async (req: Request, res: Response) => {
  const id = req.params.bannerid;
  const userId = Number(req.params.userId);
  const bannerRepo = appSource.getRepository(banner);

  const typeNameFromDb = await bannerRepo
    .createQueryBuilder("BannerDetail")
    .where("BannerDetail.bannerid = :bannerid", {
      bannerid: id,
    })
    .getOne();
  if (!typeNameFromDb?.bannerid) {
    throw new HttpException("banner not Found", 400);
  }

  try {

    await bannerRepo
      .createQueryBuilder("BannerDetail")
      .delete()
      .from(banner)
      .where("bannerid = :bannerid", { bannerid: id })
      .execute();

    const logsPayload: LogsDto = {
      userId: userId,
      userName: '',
      statusCode: 200,
      message: `Banner ${typeNameFromDb.title} deleted by -`
    }
    await InsertLog(logsPayload);

    res.status(200).send({
      IsSuccess: `banner deleted successfully!`,
    });
  } catch (error) {
    const logsPayload: LogsDto = {
      userId: userId,
      userName: '',
      statusCode: 500,
      message: `Error while deleting Banner ${typeNameFromDb.title}  by -`
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

export const changeStatusBanner = async (req: Request, res: Response) => {
  const status: bannerStatusDto = req.body;
  const BannerRepository = appSource.getRepository(banner);

  const details = await BannerRepository.findOneBy({
    bannerid: Number(status.bannerid),
  });
  if (!details) throw new HttpException("banner not Found", 400);
  try {
    await BannerRepository.createQueryBuilder()
      .update(banner)
      .set({ status: status.status })
      .where({ bannerid: Number(status.bannerid) })
      .execute();

    const logsPayload: LogsDto = {
      userId: Number(status.userId),
      userName: '',
      statusCode: 200,
      message: `Banner ${details.title} status changed to ${status.status} by -`
    }
    await InsertLog(logsPayload);

    res.status(200).send({
      IsSuccess: `Status for banner ${details.title} Updated successfully!`,
    });
  } catch (error) {
    const logsPayload: LogsDto = {
      userId: Number(status.userId),
      userName: '',
      statusCode: 500,
      message: `Error while changing status for Banner ${details.title}  to ${status.status} by -`
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
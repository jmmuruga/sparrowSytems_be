import { appSource } from "../../core/db";
import { ValidationException } from "../../core/exception";
import { LogsDto } from "../logs/logs.dto";
import { InsertLog } from "../logs/logs.service";
import { GeneralSettingsDto, generalSettingsdtovalidation, updateGeneralSettingsvalidation } from "./general.dto";
import { GeneralSettings } from "./general.model";
import { Request, Response } from "express";


export const addGeneralsettings = async (req: Request, res: Response) => {
  const payload: GeneralSettingsDto = req.body;
  const generalRepository = appSource.getRepository(GeneralSettings);
  const userId = payload.id ? payload.muid : payload.cuid;
  try {
    if (payload.id) {
      // Update existing row
      const existingSettings = await generalRepository.findOneBy({ id: payload.id });
      if (!existingSettings) {
        throw new ValidationException("General settings not found");
      }

      const { cuid, id, ...updatePayload } = payload;

      // const { id, ...updatePayload } = payload;
      await generalRepository.update({ id }, updatePayload);
      const logsPayload: LogsDto = {
        userId: userId,
        userName: '',
        statusCode: 200,
        message: `General settings ${payload.products_per_page} updated by -`
      }
      await InsertLog(logsPayload);

      return res.status(200).send({
        message: "General settings updated successfully",
      });
    } else {
      // Insert new row
      const { error } = generalSettingsdtovalidation.validate(payload);
      if (error) {
        throw new ValidationException(error.message);
      }

      const newSettings = generalRepository.create(payload);
      const savedSettings = await generalRepository.save(newSettings);
      const logsPayload: LogsDto = {
        userId: userId,
        userName: '',
        statusCode: 200,
        message: `General settings ${payload.products_per_page} added by -`
      }
      await InsertLog(logsPayload);
      return res.status(201).send({
        message: "General settings added successfully",
        data: savedSettings,
      });
    }
  } catch (error) {
    const logsPayload: LogsDto = {
      userId: userId,
      userName: '',
      statusCode: 500,
      message: `Error while saving general settings ${payload.products_per_page} by -`
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

export const getGeneralSettingsDetails = async (req: Request, res: Response) => {
  try {
    const Repository = appSource.getRepository(GeneralSettings);
    const homeSettingList = await Repository.createQueryBuilder().getMany();

    res.status(200).send({
      Result: homeSettingList,
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
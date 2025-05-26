import { appSource } from "../../core/db";
import { ValidationException } from "../../core/exception";
import { homeSettingsDto, homeSettingsDtoValidation, updateHomeSettingsValidation } from "./homeSettings.dto";
import { homeSettings } from "./homeSettings.model";
import { Request, Response } from "express";

export const addHomesettings = async (req: Request, res: Response) => {
    const payload: homeSettingsDto = req.body;
    const homeRepository = appSource.getRepository(homeSettings);
    try {
        if (payload.id) {
            console.log("Updating home settings");

            const { error: updateError } = updateHomeSettingsValidation.validate(payload);
            if (updateError) {
                throw new ValidationException(updateError.message);
            }

            const existingSettings = await homeRepository.findOneBy({ id: payload.id });
            if (!existingSettings) {
                throw new ValidationException("Home settings not found");
            }

            const { id, ...updatePayload } = payload;
            await homeRepository.update({ id }, updatePayload);

            return res.status(200).send({
                message: "Home settings updated successfully",
            });
        }

        // add new
        const { error } = homeSettingsDtoValidation.validate(payload);
        if (error) {
            throw new ValidationException(error.message);
        }

        const homeSettingsRepository = appSource.getRepository(homeSettings);

        const newSettings = homeSettingsRepository.create(payload);
        const savedSettings = await homeSettingsRepository.save(newSettings);

        return res.status(201).send({
            message: "Home settings added successfully",
            data: savedSettings,
        });

    } catch (error) {
        console.error("Error adding home settings:", error);
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

export const getHomeSettingsDetails = async (req: Request, res: Response) => {
  try {
    const Repository = appSource.getRepository(homeSettings);
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

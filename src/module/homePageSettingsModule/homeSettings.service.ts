import { appSource } from "../../core/db";
import { ValidationException } from "../../core/exception";
import { homeSettingsDto, homeSettingsDtoValidation } from "./homeSettings.dto";
import { homeSettings } from "./homeSettings.model";
import { Request, Response } from "express";

export const addHomesettings = async (req: Request, res: Response) => {
    const payload: homeSettingsDto = req.body;

    try {
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
import { appSource } from "../../core/db";
import { ValidationException } from "../../core/exception";
import { GeneralSettingsDto, generalSettingsdtovalidation, updateGeneralSettingsvalidation } from "./general.dto";
import { GeneralSettings } from "./general.model";
import { Request, Response } from "express";


export const addHomesettings = async (req: Request, res: Response) => {
    const payload: GeneralSettingsDto = req.body;
    const generalRepository = appSource.getRepository(GeneralSettings);
    try {
        if (payload.id) {
            console.log("Updating General settings");

            const { error: updateError } = updateGeneralSettingsvalidation.validate(payload);
            if (updateError) {
                throw new ValidationException(updateError.message);
            }

            const existingSettings = await generalRepository.findOneBy({ id: payload.id });
            if (!existingSettings) {
                throw new ValidationException("Home settings not found");
            }

            const { id, ...updatePayload } = payload;
            await generalRepository.update({ id }, updatePayload);

            return res.status(200).send({
                message: "General settings updated successfully",
            });
        }

        // add new
        const { error } = generalSettingsdtovalidation.validate(payload);
        if (error) {
            throw new ValidationException(error.message);
        }

        const generalSettingsRepository = appSource.getRepository(GeneralSettings);

        const newSettings = generalSettingsRepository.create(payload);
        const savedSettings = await generalSettingsRepository.save(newSettings);

        return res.status(201).send({
            message: "General settings added successfully",
            data: savedSettings,
        });

    } catch (error) {
        console.error("Error adding General settings:", error);
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
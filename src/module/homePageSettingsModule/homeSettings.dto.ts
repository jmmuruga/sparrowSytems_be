import Joi from "joi";

export interface homeSettingsDto {
    id: number;
    visible: boolean;
    category_Id: number;
};

export const homeSettingsDtoValidation = Joi.object({
    // id: Joi.number().required(),
    visible: Joi.boolean().required(),
    category_Id: Joi.number().required()
});
import Joi, { optional } from "joi";

export interface homeSettingsDto {
    id: number;
    visible: boolean;
    categoryid: number;
    subcategoryid: number;
};

export const homeSettingsDtoValidation = Joi.object({
    visible: Joi.boolean().required(),
    categoryid: Joi.number().allow(null),
    subcategoryid: Joi.number().allow(null),
    column_count: Joi.number().required(),
    row_count: Joi.number().required(),
})


export const updateHomeSettingsValidation = Joi.object({
    id: Joi.number().required(),
    visible: Joi.boolean().required(),
    categoryid: Joi.number().allow(null),
    subcategoryid: Joi.number().allow(null),
    column_count: Joi.number().required(),
    row_count: Joi.number().required(),
})

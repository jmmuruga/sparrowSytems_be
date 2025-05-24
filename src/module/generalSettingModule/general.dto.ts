import Joi from "joi";

export interface GeneralSettingsDto {
    id: number;
    products_per_page: number;
    column_count: number;
}

export const generalSettingsdtovalidation = Joi.object({
    products_per_page: Joi.number().required(),
    column_count: Joi.number().required(),
})

export const updateGeneralSettingsvalidation = Joi.object({
    id: Joi.number().required(),
    products_per_page: Joi.number().required(),
    column_count: Joi.number().required(),
})
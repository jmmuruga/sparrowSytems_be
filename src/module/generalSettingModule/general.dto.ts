import Joi from "joi";

export interface GeneralSettingsDto {
    id: number;
    products_per_page: number;
    column_count: number;
    cuid: number;
    muid: number;
}

export const generalSettingsdtovalidation = Joi.object({
    products_per_page: Joi.number().required(),
    column_count: Joi.number().required(),
    cuid: Joi.number().optional().allow(null, ''),
    muid: Joi.number().optional().allow(null, ''),

})

export const updateGeneralSettingsvalidation = Joi.object({
    id: Joi.number().required(),
    products_per_page: Joi.number().required(),
    column_count: Joi.number().required(),
    cuid: Joi.number().optional().allow(null, ''),
    muid: Joi.number().optional().allow(null, ''),

})
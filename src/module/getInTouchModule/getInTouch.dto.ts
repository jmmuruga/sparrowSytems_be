import Joi from "joi";

export interface GetInTouchDto {
    id: number;
    button_name: string;
    button_link: string;
    cuid: number;
    muid: number;
}

export const getInTouchDtoValidation = Joi.object({
    button_name: Joi.string().required(),
    button_link: Joi.string().required(),
    cuid: Joi.number().optional().allow(null, ''),
    muid: Joi.number().optional().allow(null, ''),
})

export const updateGetInTouchValidation = Joi.object({
    id: Joi.number().required(),
    button_name: Joi.string().required(),
    button_link: Joi.string().required(),
    cuid: Joi.number().optional().allow(null, ''),
    muid: Joi.number().optional().allow(null, ''),
})
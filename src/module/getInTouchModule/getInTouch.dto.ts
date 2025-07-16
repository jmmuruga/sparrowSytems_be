import Joi from "joi";

export interface GetInTouchDto {
    id: number;
    button_name: string;
    productid: number;
    cuid: number;
    muid: number;
}

export const getInTouchDtoValidation = Joi.object({
    button_name: Joi.string().required(),
    productid: Joi.number().required(),
    cuid: Joi.number().optional().allow(null, ''),
    muid: Joi.number().optional().allow(null, ''),
})

export const updateGetInTouchValidation = Joi.object({
    id: Joi.number().required(),
    button_name: Joi.string().required(),
    productid: Joi.number().required(),
    cuid: Joi.number().optional().allow(null, ''),
    muid: Joi.number().optional().allow(null, ''),
})
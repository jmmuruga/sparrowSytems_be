import Joi from "joi";

export interface GetInTouchDto {
    id: number;
    button_name: string;
    button_link: string;
}

export const getInTouchDtoValidation = Joi.object({ 
    button_name: Joi.string().required(),
    button_link: Joi.string().required(),
})

export const updateGetInTouchValidation = Joi.object({ 
    id: Joi.number().required(),
    button_name: Joi.string().required(),
    button_link: Joi.string().required()
})
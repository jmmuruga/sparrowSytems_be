import Joi from "joi";

export interface bannerDetailsDto {
    banner_id: number;
    title: string;
    description: string;
    link: string;
    image: string;
    cuid: number;
    muid: number;
}

export const bannerDetailsValidation = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    link: Joi.string().required(),
    image: Joi.string().required(),
    cuid: Joi.number().required(),
    muid: Joi.number().required()
})
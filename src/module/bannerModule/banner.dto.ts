import Joi from "joi";

export interface bannerDetailsDto {
    bannerid: number;
    title: string;
    description: string;
    link: string;
    image: string;
    cuid: number;
    muid: number;
    status: boolean;
}

export interface bannerStatusDto{
    bannerid: number;
    status: boolean;
}

export const bannerDetailsValidation = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    link: Joi.string().optional(),
    image: Joi.string().required(),
    cuid: Joi.number().optional(),
    muid: Joi.number().optional(),
    status:Joi.boolean().optional()
});

export const updateBannerValidation = Joi.object({
    bannerid: Joi.number().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    link: Joi.string().optional(),
    image: Joi.string().required(),
    cuid: Joi.number().optional(),
    muid: Joi.number().optional(),
    status: Joi.boolean().optional()
})
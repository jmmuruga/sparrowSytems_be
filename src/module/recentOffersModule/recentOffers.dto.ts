import Joi from "joi";

export interface RecentOffersDto {
    id: number;
    status: boolean;
    products_Id: string;
    cuid: number;
    muid: number;
}

export const recentOffersDtoValidation = Joi.object({
    status: Joi.boolean().required(),
    products_Id: Joi.string().required(),
    cuid: Joi.number().optional().allow(null, ''),
    muid: Joi.number().optional().allow(null, ''),
})

export const updateRecentOffersValidation = Joi.object({
    id: Joi.number().required(),
    status: Joi.boolean().required(),
    products_Id: Joi.string().required(),
    cuid: Joi.number().optional().allow(null, ''),
    muid: Joi.number().optional().allow(null, ''),
});
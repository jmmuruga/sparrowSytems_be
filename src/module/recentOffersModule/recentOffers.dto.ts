import Joi from "joi";

export interface RecentOffersDto {
    id: number;
    status: boolean;
    products_Id: string;
}

export const recentOffersDtoValidation = Joi.object({
    status: Joi.boolean().required(),
    products_Id: Joi.string().required()
})

export const updateRecentOffersValidation = Joi.object({
    id: Joi.number().required(),
    status: Joi.boolean().required(),
    products_Id: Joi.string().required()
});
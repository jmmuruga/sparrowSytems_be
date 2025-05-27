import Joi from "joi";

export interface NewProductsDto {
    id: number;
    status: boolean;
    products_Limit: number;
};

export const newProductsDtoValidation = Joi.object({
    status: Joi.boolean().required(),
    products_Limit: Joi.number().required()
});

export const updateNewProductsValidation = Joi.object({
    id: Joi.number().required(),
    status: Joi.boolean().required(),
    products_Limit: Joi.number().required()
})
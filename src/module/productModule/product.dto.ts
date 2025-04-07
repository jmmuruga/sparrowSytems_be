import Joi, { allow, optional } from "joi";

export interface productDetailsDto {
    productid: number;
    product_name: string;
    stock: string;
    brand_name: string;
    category_name: string;
    mrp: number;
    discount: number;
    offer_price: number;
    min_qty: number;
    max_qty: number;
    delivery_charges: string;
    delivery_amount: number;
    variation_group: string;
    description: string;
    terms: string;
    delivery_days: string;
    warranty: string;
    document: string;
    images: string[];
    cuid: number;
    muid: number;
}

export const productDetalsValidation = Joi.object({
    product_name: Joi.string().required(),
    stock: Joi.string().required(), // or Joi.number() if it's a quantity
    brand_name: Joi.string().required(),
    category_name: Joi.string().required(),
    mrp: Joi.number().required(),
    discount: Joi.number().required(),
    offer_price: Joi.number().required(),
    min_qty: Joi.number().required(),
    max_qty: Joi.number().required(),
    delivery_charges: Joi.string().required(),
    delivery_amount: Joi.number().optional().allow(null, ''),
    variation_group: Joi.string().optional().allow(null, ''),
    description: Joi.string().required(),
    terms: Joi.string().required(),
    delivery_days: Joi.string().required(),
    warranty: Joi.string().required(),
    document: Joi.string().required(),
    images: Joi.array().items(Joi.string()).required(),
    cuid: Joi.number().allow(null , ''),
    muid: Joi.number().allow(null , '')
});

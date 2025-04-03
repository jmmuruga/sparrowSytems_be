import Joi from "joi";

export interface productDetailsDto {
    productid: number;
    product_name: string;
    stock: string;
    brand_name: string;
    category_name: string;
    mrp: number;
    discount: number;
    offer_price: number;
    min_qly: number;
    max_qly: number;
    devivery_charges: string;
    devery_amount: number;
    variation_group: string;
    description: string;
    terms: string;
    delivery_days: string;
    warranty: string;
    document: string;
    images: string;
    cuid: number;
    muid: number;
}

export const productDetalsValidation = Joi.object({
    productid: Joi.number().required(),
    product_name: Joi.string().required(),
    stock: Joi.string().required(),
    brand_name: Joi.string().required(),
    category_name: Joi.string().required(),
    mrp: Joi.number().required(),
    discount: Joi.number().required(),
    offer_price: Joi.number().required(),
    min_qly: Joi.number().required(),
    max_qly: Joi.number().required(),
    devivery_charges: Joi.string().required(),
    devery_amount: Joi.number().required(),
    variation_group: Joi.string(),
    description: Joi.string().required(),
    terms: Joi.string().required(),
    delivery_days: Joi.string().required(),
    warrenty: Joi.string().required(),
    document: Joi.string().required(),
    images: Joi.string().required(),
    cuid: Joi.number().required(),
    muid: Joi.number().required()
})
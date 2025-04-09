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
    image1: string;
    image2: string;
    image3: string;
    image4: string;
    image5: string;
    image6: string;
    image7: string;
    cuid: number;
    muid: number;
    // status: boolean;
}

export const productDetailsValidation = Joi.object({
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
    document: Joi.string().optional().allow(null, ''),
    image1: Joi.string().optional().allow(null, ''),
    image2: Joi.string().optional().allow(null, ''),
    image3: Joi.string().optional().allow(null, ''),
    image4: Joi.string().optional().allow(null, ''),
    image5: Joi.string().optional().allow(null, ''),
    image6: Joi.string().optional().allow(null, ''),
    image7: Joi.string().optional().allow(null, ''),
    cuid: Joi.number().allow(null , ''),
    muid: Joi.number().allow(null , ''),
    // status: Joi.boolean().required(),

});

export const updateDetailsValidation = Joi.object({
    productid: Joi.number().required(),
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
    document: Joi.string().optional().allow(null, ''),
    image1: Joi.string().optional().allow(null, ''),
    image2: Joi.string().optional().allow(null, ''),
    image3: Joi.string().optional().allow(null, ''),
    image4: Joi.string().optional().allow(null, ''),
    image5: Joi.string().optional().allow(null, ''),
    image6: Joi.string().optional().allow(null, ''),
    image7: Joi.string().optional().allow(null, ''),
    cuid: Joi.number().allow(null , ''),
    muid: Joi.number().allow(null , ''),
    // status: Joi.boolean().required(),

});

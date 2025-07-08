import Joi from "joi";

export interface productDetailsDto {
  productid: number;
  product_name: string;
  stock: string;
  brandid: number;
  categoryid: string;
  mrp: number;
  discount: number;
  offer_price: number;
  min_qty: number;
  max_qty: number;
  delivery_charges: string;
  delivery_amount: number;
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
  status: boolean;
  subcategoryid: string;
}
export interface productStatusDto {
  productid: string;
  status: boolean;
}

export const productDetailsValidation = Joi.object({
  product_name: Joi.string().required(),
  stock: Joi.string().required(),
  brandid: Joi.number().required(),
  categoryid: Joi.string().optional().allow(null, ''),
  subcategoryid: Joi.string().optional().allow(null, ''),
  mrp: Joi.number().required(),
  discount: Joi.number().required(),
  offer_price: Joi.number().required(),
  min_qty: Joi.number().required(),
  max_qty: Joi.number().required(),
  delivery_charges: Joi.string().required(),
  delivery_amount: Joi.number().optional().allow(null, ''),
  description: Joi.string().required(),
  terms: Joi.string().required(),
  delivery_days: Joi.string().optional(),
  warranty: Joi.string().required(),
  document: Joi.string().optional().allow(null, ''),
  status: Joi.boolean().optional(),
  cuid: Joi.number().optional().allow(null, ''),
  muid: Joi.number().optional().allow(null, ''),

  images: Joi.array().items(
    Joi.object({
      image: Joi.string().required(),
      image_title: Joi.string().allow(""),
    })
  ).optional(),
});

export const updateDetailsValidation = Joi.object({
  productid: Joi.number().required(),
  product_name: Joi.string().required(),
  stock: Joi.string().required(),
  brandid: Joi.number().required(),
  categoryid: Joi.string().optional().allow(null, ''),
  subcategoryid: Joi.string().optional().allow(null, ''),
  mrp: Joi.number().required(),
  discount: Joi.number().required(),
  offer_price: Joi.number().required(),
  min_qty: Joi.number().required(),
  max_qty: Joi.number().required(),
  delivery_charges: Joi.string().required(),
  delivery_amount: Joi.number().optional().allow(null, ""),
  description: Joi.string().required(),
  terms: Joi.string().required(),
  delivery_days: Joi.string().required(),
  warranty: Joi.string().required(),
  document: Joi.string().optional().allow(null, ""),
  status: Joi.boolean().optional(),
  cuid: Joi.number().optional().allow(null, ''),
  muid: Joi.number().optional().allow(null, ''),

  images: Joi.array().items(
    Joi.object({
      image: Joi.string().required(),
      image_title: Joi.string().allow(""),
    })
  ).optional(),
});

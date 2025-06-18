import Joi, { allow, optional } from "joi";

export interface productDetailsDto {
  productid: number;
  product_name: string;
  stock: string;
  brandid: number;
  categoryid: number;
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
  status: boolean;
  // categoryName?: string;
  subcategoryid: number;
}
export interface productStatusDto {
  productid: string;
  status: boolean;
}

// export const productDetailsValidation = Joi.object({
//   product_name: Joi.string().required(),
//   stock: Joi.string().required(), // or Joi.number() if it's a quantity
//   brand_name: Joi.string().required(),
//   category_name: Joi.string().optional(),
//   subcategoryid: Joi.string().optional(),
//   mrp: Joi.number().required(),
//   discount: Joi.number().required(),
//   offer_price: Joi.number().required(),
//   min_qty: Joi.number().required(),
//   max_qty: Joi.number().required(),
//   delivery_charges: Joi.string().required(),
//   delivery_amount: Joi.number().optional().allow(null, ""),
//   variation_group: Joi.string().optional().allow(null, ""),
//   description: Joi.string().required(),
//   terms: Joi.string().required(),
//   delivery_days: Joi.string().required(),
//   warranty: Joi.string().required(),
//   document: Joi.string().optional().allow(null, ""),
//   image1: Joi.string().optional().allow(null, ""),
//   image2: Joi.string().optional().allow(null, ""),
//   image3: Joi.string().optional().allow(null, ""),
//   image4: Joi.string().optional().allow(null, ""),
//   image5: Joi.string().optional().allow(null, ""),
//   image6: Joi.string().optional().allow(null, ""),
//   image7: Joi.string().optional().allow(null, ""),
//   cuid: Joi.number().allow(null, ""),
//   muid: Joi.number().allow(null, ""),
//   status: Joi.boolean().optional(),
// });

// export const productDetailsValidation = Joi.object({
//   product_name: Joi.string().required(),
//   stock: Joi.string().required(),
//   brand_name: Joi.string().required(),

//   category_name: Joi.string().allow("", null),
//   subcategoryid: Joi.string().allow("", null),

//   mrp: Joi.number().required(),
//   discount: Joi.number().required(),
//   offer_price: Joi.number().required(),
//   min_qty: Joi.number().required(),
//   max_qty: Joi.number().required(),
//   delivery_charges: Joi.string().required(),
//   delivery_amount: Joi.number().optional().allow(null, ""),
//   variation_group: Joi.string().optional().allow(null, ""),
//   description: Joi.string().required(),
//   terms: Joi.string().required(),
//   delivery_days: Joi.string().required(),
//   warranty: Joi.string().required(),
//   document: Joi.string().optional().allow(null, ""),
//   image1: Joi.string().optional().allow(null, ""),
//   image2: Joi.string().optional().allow(null, ""),
//   image3: Joi.string().optional().allow(null, ""),
//   image4: Joi.string().optional().allow(null, ""),
//   image5: Joi.string().optional().allow(null, ""),
//   image6: Joi.string().optional().allow(null, ""),
//   image7: Joi.string().optional().allow(null, ""),
//   cuid: Joi.number().allow(null, ""),
//   muid: Joi.number().allow(null, ""),
//   status: Joi.boolean().optional(),
// }).xor("category_name", "subcategoryid"); // ✅ ensures exactly one is present

// export const updateDetailsValidation = Joi.object({
//   productid: Joi.number().required(),
//   product_name: Joi.string().required(),
//   stock: Joi.string().required(), // or Joi.number() if it's a quantity
//   brand_name: Joi.string().required(),
//   category_name: Joi.string().optional(),
//   subcategoryid: Joi.string().optional(),
//   mrp: Joi.number().required(),
//   discount: Joi.number().required(),
//   offer_price: Joi.number().required(),
//   min_qty: Joi.number().required(),
//   max_qty: Joi.number().required(),
//   delivery_charges: Joi.string().required(),
//   delivery_amount: Joi.number().optional().allow(null, ""),
//   variation_group: Joi.string().optional().allow(null, ""),
//   description: Joi.string().required(),
//   terms: Joi.string().required(),
//   delivery_days: Joi.string().required(),
//   warranty: Joi.string().required(),
//   document: Joi.string().optional().allow(null, ""),
//   image1: Joi.string().optional().allow(null, ""),
//   image2: Joi.string().optional().allow(null, ""),
//   image3: Joi.string().optional().allow(null, ""),
//   image4: Joi.string().optional().allow(null, ""),
//   image5: Joi.string().optional().allow(null, ""),
//   image6: Joi.string().optional().allow(null, ""),
//   image7: Joi.string().optional().allow(null, ""),
//   cuid: Joi.number().allow(null, ""),
//   muid: Joi.number().allow(null, ""),
//   status: Joi.boolean().optional(),
// });

// export const productDetailsValidation = Joi.object({
//   product_name: Joi.string().required(),
//   stock: Joi.string().required(),
//   brandid: Joi.number().required(),
//   categoryid: Joi.number().optional(),
//   mrp: Joi.number().required(),
//   discount: Joi.number().required(),
//   offer_price: Joi.number().required(),
//   min_qty: Joi.number().required(),
//   max_qty: Joi.number().required(),
//   delivery_charges: Joi.string().required(),
//   delivery_amount: Joi.number().optional().allow(null),
//   variation_group: Joi.string().allow('').optional(),
//   description: Joi.string().required(),
//   terms: Joi.string().required(),
//   delivery_days: Joi.string().optional(),
//   warranty: Joi.string().required(),
//   document: Joi.string().optional().allow(""), 
//   subcategoryid: Joi.number().optional().allow("", null),

//   images: Joi.array().items(
//     Joi.object({
//       image: Joi.string().required(),
//       image_title: Joi.string().allow(""),
//     })
//   ).optional(),
// });

export const productDetailsValidation = Joi.object({
  product_name: Joi.string().required(),
  stock: Joi.string().required(),
  brandid: Joi.number().required(),

  // Allow either categoryid or subcategoryid, both optional
  categoryid: Joi.number().allow(null).optional(),
  subcategoryid: Joi.number().allow(null).optional(),

  mrp: Joi.number().required(),
  discount: Joi.number().required(),
  offer_price: Joi.number().required(),
  min_qty: Joi.number().required(),
  max_qty: Joi.number().required(),
  delivery_charges: Joi.string().required(),
  delivery_amount: Joi.number().optional().allow(null),
  variation_group: Joi.string().allow('').optional(),
  description: Joi.string().required(),
  terms: Joi.string().required(),
  delivery_days: Joi.string().optional(),
  warranty: Joi.string().required(),
  document: Joi.string().optional().allow(""),
  status: Joi.boolean().optional(),

  images: Joi.array().items(
    Joi.object({
      image: Joi.string().required(),
      image_title: Joi.string().allow(""),
    })
  ).optional(),
});

// export const updateDetailsValidation = Joi.object({
//   productid: Joi.number().required(),
//   product_name: Joi.string().required(),
//   stock: Joi.string().required(),
//   brandid: Joi.number().required(),

//   categoryid: Joi.number().allow("", null),
//   subcategoryid: Joi.number().allow("", null),

//   mrp: Joi.number().required(),
//   discount: Joi.number().required(),
//   offer_price: Joi.number().required(),
//   min_qty: Joi.number().required(),
//   max_qty: Joi.number().required(),
//   delivery_charges: Joi.string().required(),
//   delivery_amount: Joi.number().optional().allow(null, ""),
//   variation_group: Joi.string().optional().allow(null, ""),
//   description: Joi.string().required(),
//   terms: Joi.string().required(),
//   delivery_days: Joi.string().required(),
//   warranty: Joi.string().required(),
//   document: Joi.string().optional().allow(null, ""),
//   status: Joi.boolean().optional(),
//   images: Joi.array().items(
//     Joi.object({
//       image: Joi.string().required(),
//       image_title: Joi.string().allow(""),
//     })
//   ).optional(),
// }).xor("category_name", "subcategoryid");

export const updateDetailsValidation = Joi.object({
  productid: Joi.number().required(),
  product_name: Joi.string().required(),
  stock: Joi.string().required(),
  brandid: Joi.number().required(),

  categoryid: Joi.number().allow("", null).optional(),
  subcategoryid: Joi.number().allow("", null).optional(),

  mrp: Joi.number().required(),
  discount: Joi.number().required(),
  offer_price: Joi.number().required(),
  min_qty: Joi.number().required(),
  max_qty: Joi.number().required(),
  delivery_charges: Joi.string().required(),
  delivery_amount: Joi.number().optional().allow(null, ""),
  variation_group: Joi.string().optional().allow(null, ""),
  description: Joi.string().required(),
  terms: Joi.string().required(),
  delivery_days: Joi.string().required(),
  warranty: Joi.string().required(),
  document: Joi.string().optional().allow(null, ""),
  status: Joi.boolean().optional(),

  images: Joi.array().items(
    Joi.object({
      image: Joi.string().required(),
      image_title: Joi.string().allow(""),
    })
  ).optional(),
});

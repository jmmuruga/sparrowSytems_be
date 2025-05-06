import Joi from "joi";

export interface allOrdersDto {
  orderid: number;
  customer_name: string;
  cuid: number;
  muid: number;
  status: boolean;
  mobile_number: string;
  Address: string;
  landmark: string;
  pincode: number;
  payment_method: string;
  orderItems: orderTitemsDto[];
}

export interface orderTitemsDto {
  productid: number;
  product_name: string;
  quantity: number;
  total_amount: number;
  offer_price: number
}

export interface allOrdersStatusDto {
  orderid: string;
  status: boolean;
}

export const allOrdersValidation = Joi.object({
  customer_name: Joi.string().required(),
  // total_amount: Joi.number().required(),
//   action_date: Joi.number().optional(),
  cuid: Joi.number().optional(),
  muid: Joi.number().optional(),
  mobile_number: Joi.string().required(),
  Address: Joi.string().required(),
  landmark: Joi.string().required(),
  pincode: Joi.number().required(),
  payment_method: Joi.string().required(),
  quantity: Joi.number().required(),
  orderItems: Joi.array().items(
    Joi.object({
      productid: Joi.number().required(),
      product_name: Joi.string().required(),
      quantity: Joi.number().required(),
      offer_price: Joi.number().required(),
      total_amount: Joi.number().required(),
    })
  ).required(),
});

export const updateAllOrdersValidation = Joi.object({
  orderid: Joi.number().required(),
  customer_name: Joi.string().required(),
  // total_amount: Joi.number().required(),
//   action_date: Joi.number().optional(),
  cuid: Joi.number().optional(),
  muid: Joi.number().optional(),
  status: Joi.boolean().optional(),
  mobile_number: Joi.string().required(),
  Address: Joi.string().required(),
  landmark: Joi.string().required(),
  pincode: Joi.number().required(),
  payment_method: Joi.string().required(),
  quantity: Joi.number().required(),
  orderItems: Joi.array().items(
    Joi.object({
      productid: Joi.number().required(),
      product_name: Joi.string().required(),
      quantity: Joi.number().required(),
      offer_price: Joi.number().required(),
      total_amount: Joi.number().required(),
    })
  ).required(),
});

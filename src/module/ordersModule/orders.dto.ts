import Joi from "joi";

// export interface ordersDto {
//   orderid: number;
//   productid: number;
//   customerid: number;
//   quantity: number;
//   total_amount: number;
//   offer_price: number;
//   payment_method: string;
// }
// orders.dto.ts

export interface OrderItem {
  productid: number;
  quantity: number;
  offer_price: number;
}

export interface ordersDto {
  orderid: number;
  customerid: number;
  payment_method: string;
  status: string;
  orderItems: OrderItem[]; // ✅ Add this
}

export const ordersDtoValidation = Joi.object({
  customerid: Joi.number().required(),
  payment_method: Joi.string().required(),
  status: Joi.string().required(),
  orderItems: Joi.array().items(
    Joi.object({
      productid: Joi.number().required(),
      quantity: Joi.number().required(),
      offer_price: Joi.number().required(),
    })
  ).required(),
});

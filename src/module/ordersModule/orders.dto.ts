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
  open_orders_date?: Date;
  processing_orders_date?: Date;
  failure_orders_date?: Date;
  canceled_orders_date?: Date;
  shipped_orders_date?: Date;
  closed_orders_date?: Date;
}
export interface orderStatusDto {
  orderid: number;
  status: string;
  date: Date;
}

export const ordersDtoValidation = Joi.object({
  customerid: Joi.number().required(),
  payment_method: Joi.string().required(),
  status: Joi.string().required(),
  orderItems: Joi.array()
    .items(
      Joi.object({
        productid: Joi.number().required(),
        quantity: Joi.number().required(),
        offer_price: Joi.number().required(),
      })
    )
    .required(),
});

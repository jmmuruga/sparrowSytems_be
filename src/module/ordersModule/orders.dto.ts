import Joi from "joi";

export interface OrderItem {
  productid: number;
  quantity: number;
  offer_price: number;
  cuid: number;
  muid: number;
}

export interface ordersDto {
  orderid: number;
  customerid: number;
  payment_method: string;
  status: string;
  orderItems: OrderItem[];
  open_orders_date?: Date;
  processing_orders_date?: Date;
  failure_orders_date?: Date;
  canceled_orders_date?: Date;
  shipped_orders_date?: Date;
  closed_orders_date?: Date;
  delivery_orders_date: Date;
  return_orders_date: Date;
  address_id: number;
  cuid: number;
  muid: number;
}
export interface orderStatusDto {
  orderid: number;
  status: string;
  date: Date;
  userId: string;
}

export const ordersDtoValidation = Joi.object({
  orderid: Joi.number().required(),
  customerid: Joi.number().required(),
  payment_method: Joi.string().required(),
  status: Joi.string().required(),
  address_id: Joi.number().allow(null),
  cuid: Joi.number().optional().allow(null, ''),
  muid: Joi.number().optional().allow(null, ''),
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
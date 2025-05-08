import Joi from "joi";

export interface CustomerCartDto {
  productid: number;
  customerid: number;
  quantity: number;
}

export const CustomerCartValidation = Joi.object({
  productid: Joi.number().required(),
  customerid: Joi.number().required(),
  quantity: Joi.number().required(),
});

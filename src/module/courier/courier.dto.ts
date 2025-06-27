import Joi from "joi";

export interface CourierDto {
  courier_id: number;
  Courier_Name: string;
  Courier_Link: string;
  status: boolean;
  cuid: number;
  muid: number;
}

export const CourierValidate = Joi.object({
  Courier_Name: Joi.string().required(),
  Courier_Link: Joi.string().required(),
  status: Joi.boolean().required(),
  cuid: Joi.optional().allow(null, ""),
  muid: Joi.optional().allow(null, ""),
});

export interface changecourierStatusDto {
  courier_id: number;
  status: boolean;
}
export const CourierUpdateValidate = Joi.object({
  courier_id: Joi.number().required(),
  Courier_Name: Joi.string().required(),
  Courier_Link: Joi.string().required(),
  status: Joi.boolean().required(),
  cuid: Joi.optional().allow(null, ""),
  muid: Joi.optional().allow(null, ""),
});

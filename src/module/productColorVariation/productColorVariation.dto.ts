import Joi from "joi";

export interface productColorVariationDto {
  id: number;
  product_id: string;
  selected_productid: string;
  imageid: string;
  colour: string;
  colour_code: string;
  cuid: number;
  muid: number;
}

export const productColorVariationValidate = Joi.object({
  product_id: Joi.string().required(),
  selected_productid: Joi.string().required(),
  imageid: Joi.string().required(),
  colour: Joi.string().required(),
  colour_code: Joi.string().required(),
  cuid: Joi.optional().allow(null, ""),
  muid: Joi.optional().allow(null, ""),
});

export const productColorUpadteVariationValidate = Joi.object({
  id: Joi.number().required(),
  product_id: Joi.string().required(),
  selected_productid: Joi.string().required(),
  imageid: Joi.string().required(),
  colour: Joi.string().required(),
  colour_code: Joi.string().required(),
  cuid: Joi.optional().allow(null, ""),
  muid: Joi.optional().allow(null, ""),
});

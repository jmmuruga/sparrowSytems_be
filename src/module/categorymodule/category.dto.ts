import Joi from "joi";


export interface CategoryDto {
  categoryid: number;
  categoryname: string;
  categoryicon: string;
  cuid: number;
  muid: number;
}


export const categoryValidation = Joi.object({
  categoryname: Joi.string().required(),
  categoryicon: Joi.string().required(),
  cuid: Joi.optional().allow(null, ""),
  muid: Joi.optional().allow(null, ""),
});


export const categoryUpdateValidation = Joi.object({
  categoryid: Joi.number().required(),
  categoryname: Joi.string().required(),
  categoryicon: Joi.string().required(),
  cuid: Joi.optional().allow(null, ""),
  muid: Joi.optional().allow(null, ""),
});



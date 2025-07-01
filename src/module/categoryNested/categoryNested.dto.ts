import Joi from "joi";

export interface CategoryNestedDto {
  subcategoryid: number;
  categoryname: string;
  parentcategory: string;
  categoryicon: string;
  status: boolean;
  cuid: number;
  muid: number;
}

export const categorynestedValidation = Joi.object({
  categoryname: Joi.string().required(),
  categoryicon: Joi.string().required(),
  parentcategory: Joi.string().required(),
  status: Joi.boolean().required(),
  cuid: Joi.optional().allow(null, ""),
  muid: Joi.optional().allow(null, ""),
});

export interface changenestedCategroyStatusDto {
  subcategoryid: number;
  status: boolean;
}

export const categorynestedUpdateValidation = Joi.object({
  subcategoryid: Joi.number().required(),
  parentcategory: Joi.string().required(),
  categoryname: Joi.string().required(),
  categoryicon: Joi.string().required(),
  status: Joi.boolean().required(),
  cuid: Joi.optional().allow(null, ""),
  muid: Joi.optional().allow(null, ""),
});

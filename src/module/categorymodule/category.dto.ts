import Joi from "joi";

//parent dto
export interface CategoryDto {
  categoryid: number;
  categoryname: string;
  categoryicon: string;
  status: boolean;
  cuid: number;
  muid: number;
}

export const categoryValidation = Joi.object({
  categoryname: Joi.string().required(),
  categoryicon: Joi.string().required(),
  status: Joi.boolean().required(),
  cuid: Joi.optional().allow(null, ""),
  muid: Joi.optional().allow(null, ""),
});

export interface changeCategroyStatusDto {
  categoryid: number;
  status: boolean;
  userId: string;
}

export const categoryUpdateValidation = Joi.object({
  categoryid: Joi.number().required(),
  categoryname: Joi.string().required(),
  categoryicon: Joi.string().required(),
  status: Joi.boolean().required(),
  cuid: Joi.optional().allow(null, ""),
  muid: Joi.optional().allow(null, ""),
});

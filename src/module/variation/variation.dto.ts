import Joi from "joi";

export interface variationDto {
  id: number;
  variationGroupId: string;
  variationGroup: string;
  variationname: string;
  productid: string;
  // rowId: string;
  status: boolean;
  cuid: number;
  muid: number;
}

export const variationValidate = Joi.object({
  variationGroup: Joi.string().required(),
  variationGroupId: Joi.string().required(),
  variationname: Joi.string().required(),
  productid: Joi.string().required(),
  // rowId: Joi.string().required(),

  status: Joi.boolean().required(),
  cuid: Joi.optional().allow(null, ""),
  muid: Joi.optional().allow(null, ""),
});

export interface changeVariationStatusDto {
  id: number;
  status: boolean;
}

export const variationUpdateValidate = Joi.object({
  variationGroup: Joi.string().required(),
  variationGroupId: Joi.string().required(),
  variationname: Joi.string().required(),
  // rowId: Joi.string().required(),
  productid: Joi.string().required(),
  status: Joi.boolean().required(),
  cuid: Joi.optional().allow(null, ""),
  muid: Joi.optional().allow(null, ""),
});

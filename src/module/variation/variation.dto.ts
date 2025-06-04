import Joi from "joi";

export interface variationDto {
  id: number;
  variationid: string;
  variationGroup: string;
  name: string;
  itemId: string;
  status: boolean;
  cuid: number;
  muid: number;
}

export const variationValidate = Joi.object({
  variationGroup: Joi.string().required(),
  variationid: Joi.string().required(),
  name: Joi.string().required(),
  itemId: Joi.string().required(),
  // status: Joi.boolean().required(),
  cuid: Joi.optional().allow(null, ""),
  muid: Joi.optional().allow(null, ""),
});

export const variationUpdateValidate = Joi.object({
  id: Joi.number().required(),
  variationGroup: Joi.string().required(),
  variationid: Joi.string().required(),
  name: Joi.string().required(),
  itemId: Joi.string().required(),
  status: Joi.boolean().required(),
  cuid: Joi.optional().allow(null, ""),
  muid: Joi.optional().allow(null, ""),
});

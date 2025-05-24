import Joi from "joi";

export interface currentOpeningsDto {
  id: number;
  JobName: string;
  Description: string;
  status: boolean;
  cuid: number;
  muid: number;
}

export const currentOpeningsValidation = Joi.object({
  JobName: Joi.string().required(),
  Description: Joi.string().required(),
  status: Joi.boolean().required(),
  cuid: Joi.optional().allow(null, ""),
  muid: Joi.optional().allow(null, ""),
});

export const currentOpeningsUpdateValidation = Joi.object({
  id: Joi.number().required(),
  JobName: Joi.string().required(),
  Description: Joi.string().required(),
  status: Joi.boolean().required(),
  cuid: Joi.optional().allow(null, ""),
  muid: Joi.optional().allow(null, ""),
});

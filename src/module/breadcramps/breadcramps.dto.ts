import Joi from "joi";

export interface breadcrampsDto {
  id: number;
  Title: string;
  Description: string;
  image: string;
  // status: boolean;
  cuid: number;
  muid: number;
  userId: string;
}

export const breadcrampsValidation = Joi.object({
  Title: Joi.string().required(),
  Description: Joi.string().required(),
  image: Joi.string().required(),
  // status: Joi.boolean().required(),
  cuid: Joi.optional().allow(null, ""),
  muid: Joi.optional().allow(null, ""),
});


export const updateBreadcrampsValidation = Joi.object({
  id: Joi.number().required(),
  Title: Joi.string().required(),
  Description: Joi.string().required(),
  image: Joi.string().required(),
  // status: Joi.boolean().required(),
  cuid: Joi.optional().allow(null, ""),
  muid: Joi.optional().allow(null, ""),
});

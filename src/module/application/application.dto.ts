import Joi from "joi";

export interface applicationDto {
  application_id: number;
  name: string;
  jobtitle: string;
  contact_number: string;
  mail_id: string;
  Description: string;
  count: boolean;
  file: string;
  cuid: number;
  muid: number;
}

export const applicationValidate = Joi.object({
  jobtitle: Joi.string().required(),
  name: Joi.string().required(),
  contact_number: Joi.string().required(),
  mail_id: Joi.string().required(),
  Description: Joi.string().required(),
  count: Joi.boolean().required(),
  file: Joi.string().required(),
  cuid: Joi.optional().allow(null, ""),
  muid: Joi.optional().allow(null, ""),
});

export const applicationUpdateValidation = Joi.object({
  application_id: Joi.number().required(),
  jobtitle: Joi.string().required(),
  name: Joi.string().required(),
  contact_number: Joi.string().required(),
  mail_id: Joi.string().required(),
  Description: Joi.string().required(),
  count: Joi.boolean().required(),
  file: Joi.string().required(),
  cuid: Joi.optional().allow(null, ""),
  muid: Joi.optional().allow(null, ""),
});

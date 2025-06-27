import Joi from "joi";

export interface brandDto {
  brandid: number;
  brandname: string;
  company_name: string;
  servicecenter_name: string;
  pincode: string;
  city: string;
  state: string;
  country: string;
  contact_number: string;
  mobile_number: string;
  customercare_number: string;
  tollfree_number: string;
  email: string;
  website: string;
  description: string;
  status: boolean;
  brandimage: string;
  cuid: number;
  muid: number;
}
export const brandValidation = Joi.object({
  brandname: Joi.string().required(),
  company_name: Joi.string().required(),
  servicecenter_name: Joi.string().required(),
  servicecentre_address: Joi.string().required(),
  pincode: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  country: Joi.string().required(),
  contact_number: Joi.string().required(),
  mobile_number: Joi.string().required(),
  customercare_number: Joi.string().allow("", null).optional(),
  tollfree_number: Joi.string().allow("", null).optional(),
  email: Joi.string().required(),
  website: Joi.string().required(),
  description: Joi.string().required(),
  status: Joi.boolean().required(),
  brandimage: Joi.string().required(),
  cuid: Joi.optional().allow(null, ""),
  muid: Joi.optional().allow(null, ""),
});

export interface changebrandStatusDto {
  brandid: number;
  status: boolean;
}
export const updateBrandValidation = Joi.object({
  brandid: Joi.number().required(),
  company_name: Joi.string().required(),
  brandname: Joi.string().required(),
  servicecenter_name: Joi.string().required(),
  servicecentre_address: Joi.string().required(),
  pincode: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  country: Joi.string().required(),
  contact_number: Joi.string().required(),
  mobile_number: Joi.string().required(),
  customercare_number: Joi.string().allow("", null).optional(),
  tollfree_number: Joi.string().allow("", null).optional(),
  email: Joi.string().required(),
  website: Joi.string().required(),
  description: Joi.string().required(),
  status: Joi.boolean().required(),
  brandimage: Joi.string().required(),
  cuid: Joi.optional().allow(null, ""),
  muid: Joi.optional().allow(null, ""),
});

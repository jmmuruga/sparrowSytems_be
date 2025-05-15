import Joi from "joi";

export interface customerAddressDto {
  id: number;
  customerid: number;
  door_no: string;
  house_name: string;
  street_name1: string;
  street_name2: string;
  place: string;
  post: string;
  taluk: string;
  district: string;
  isdelete: boolean;
  pincode: string;
  cuid: number;
  muid: number;
}

export const customerAddressValiadtion = Joi.object({
  door_no: Joi.string().required(),
  house_name: Joi.string().required(),
  street_name1: Joi.string().required(),
  street_name2: Joi.string().required(),
  place: Joi.string().required(),
  post: Joi.string().required(),
  taluk: Joi.string().required(),
  isdelete: Joi.boolean().required(),
  district: Joi.string().required(),
  pincode: Joi.string().required(),
  cuid: Joi.optional().allow(null, ""),
  muid: Joi.optional().allow(null, ""),
  customerid: Joi.number().required(),
});

export const customerUpadteValidation = Joi.object({
  id: Joi.number().required(),
  door_no: Joi.string().required(),
  house_name: Joi.string().required(),
  street_name1: Joi.string().required(),
  street_name2: Joi.string().required(),
  place: Joi.string().required(),
  post: Joi.string().required(),
  taluk: Joi.string().required(),
  district: Joi.string().required(),
  pincode: Joi.string().required(),
  cuid: Joi.optional().allow(null, ""),
  muid: Joi.optional().allow(null, ""),
  customerid: Joi.number().required(),
});


export interface deleteAddressDto{
  id : number;
}
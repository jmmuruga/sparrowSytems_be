import Joi from "joi";

export interface customerDetailsDto {
  customerid: number;
  email: string;
  customername: string;
  customeraddress: string;
  pincode:string;
  mobilenumber: string;
  password: string;
  confirmpassword: string;
  cuid: number;
  muid: number;
}

export const customerDetailsValiadtion = Joi.object({
        email: Joi.string().required(),
        customername: Joi.string().required(),
        mobilenumber:Joi.string().length(10).required(),
        customeraddress:Joi.string().required(),
        pincode:Joi.string().required(),
        password: Joi.string().required(),
        confirmpassword: Joi.string().required(),
        cuid: Joi.optional().allow(null , ''),
        muid: Joi.optional().allow(null , ''),
  })

  export const customerDetailsUpdateValidation = Joi.object({
    customerid: Joi.number().required(),
    email: Joi.string().required(),
    customername: Joi.string().required(),
    mobilenumber:Joi.string().length(10).required(),
    customeraddress:Joi.string().required(),
    pincode:Joi.string().required(),
    password: Joi.string().required(),
    confirmpassword: Joi.string().required(),
    cuid: Joi.optional().allow(null , ''),
    muid: Joi.optional().allow(null , ''),
  })

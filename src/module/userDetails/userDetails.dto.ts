import Joi from "joi";

export interface userDetailsDto {
    userid: number;
    e_mail: string;
    usertype: string;
    password: string;
    confirmpassword: string;
    cuid: number;
    muid: number;
}
export const userDetailsValidation = Joi.object({
    userid: Joi.number().optional().allow(null, ""),
    e_mail: Joi.string().required(),
    usertype: Joi.string().required(),
    password: Joi.string().required(),
    confirmpassword: Joi.string().required(),
    cuid: Joi.number().required(),
    muid: Joi.number().required(),
})


export const resetPasswordValidation = Joi.object({
    userid: Joi.number().required(),
    otp: Joi.string().required(),
    password: Joi.string().required(),
    c_password: Joi.string().required(),
    muid: Joi.number().required(),
})
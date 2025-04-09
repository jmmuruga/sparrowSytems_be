import Joi from "joi";

export interface userDetailsDto {
    userid: number;
    email: string;
    userType: string;
    password: string;
    confirmPassword: string;
    cuid: number;
    muid: number;
    
}
export const userDetailsValidation = Joi.object({
    email: Joi.string().required(),
    userType: Joi.string().required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().required(),
    cuid: Joi.optional().allow(null , ''),
    muid: Joi.optional().allow(null , ''),
})


export const resetPasswordValidation = Joi.object({
    userid: Joi.number().required(),
    otp: Joi.string().required(),
    password: Joi.string().required(),
    c_password: Joi.string().required(),
    muid: Joi.number().required(),
})
import Joi from "joi";

export interface ContactFormDto {
    form_id: number;
    customer_name: string;
    customer_company: string;
    mobileNumber: number;
    e_mail: string;
    message: string;
}

export const ContactFormDtoValidation = Joi.object({
    customer_name: Joi.string().required(),
    customer_company: Joi.string().required(),
    mobileNumber: Joi.number().required(),
    e_mail: Joi.string().required(),
    message: Joi.string().required(),
})

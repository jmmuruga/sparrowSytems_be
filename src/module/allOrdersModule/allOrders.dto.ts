import Joi from "joi";

export interface allOrdersDto {
    customerid: number;
    customer_name: string;
    total_amount: number;
    action_date: number;
    cuid: number;
    muid: number;
    status: boolean;
    mobile_number: string;
    Address: string;
    landmark: string;
    pincode: number;
    payment_method: string;
}

export interface allOrdersStatusDto{
    customerid: string;
    status: boolean;
}

export const allOrdersValidation = Joi.object({
    customer_name: Joi.string().required(),
    total_amount: Joi.number().required(),
    action_date: Joi.number().required(),
    cuid: Joi.number().optional(),
    muid: Joi.number().optional(),
    mobile_number: Joi.string().required(),
    Address: Joi.string().required(),
    landmark: Joi.string().required(),
    pincode: Joi.number().required(),
    payment_method: Joi.string().required(),
});

export const updateAllOrdersValidation = Joi.object({
    customerid: Joi.number().required(),
    customer_name: Joi.string().required(),
    total_amount: Joi.number().required(),
    action_date: Joi.number().required(),
    cuid: Joi.number().optional(),
    muid: Joi.number().optional(),
    status: Joi.boolean().optional(),
    mobile_number: Joi.string().required(),
    Address: Joi.string().required(),
    landmark: Joi.string().required(),
    pincode: Joi.number().required(),
    payment_method: Joi.string().required(),
})
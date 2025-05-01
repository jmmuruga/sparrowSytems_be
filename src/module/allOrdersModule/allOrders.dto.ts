import Joi from "joi";

export interface allOrdersDto {
    orderid: number;
    customer_name: string;
    total_amount: number;
    action_date: number;
    cuid: number;
    muid: number;
    status: boolean;
}

export interface allOrdersStatusDto{
    orderid: string;
    status: boolean;
}

export const allOrdersValidation = Joi.object({
    customer_name: Joi.string().required(),
    total_amount: Joi.number().required(),
    action_date: Joi.number().required(),
    cuid: Joi.number().optional(),
    muid: Joi.number().optional()
});

export const updateAllOrdersValidation = Joi.object({
    orderid: Joi.number().required(),
    customer_name: Joi.string().required(),
    total_amount: Joi.number().required(),
    action_date: Joi.number().required(),
    cuid: Joi.number().optional(),
    muid: Joi.number().optional(),
    status: Joi.boolean().optional()
})
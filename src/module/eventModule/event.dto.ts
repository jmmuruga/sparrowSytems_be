import Joi from "joi";

export interface eventDetailsDto {
  eventid: number;
  event_name: string;
  description: string;
  image: string;
  status: boolean;
  cuid: number;
  muid: number;
}

export interface eventStatusDto {
  eventid: number;
  status: boolean;
  userId: string;
}

export const eventDtoValidation = Joi.object({
  event_name: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string().required(),
  status: Joi.boolean().optional(),
  cuid: Joi.number().optional().allow(null, ''),
  muid: Joi.number().optional().allow(null, ''),
});

export const updateEventValidation = Joi.object({
  eventid: Joi.number().required(),
  event_name: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string().required(),
  status: Joi.boolean().optional(),
  cuid: Joi.number().optional().allow(null, ''),
  muid: Joi.number().optional().allow(null, ''),
});

export const deleteEventValidation = Joi.object({
  event_name: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string().required(),
  status: Joi.boolean().optional(),
  cuid: Joi.number().optional().allow(null, ''),
  muid: Joi.number().optional().allow(null, ''),
});

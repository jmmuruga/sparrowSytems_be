import Joi from "joi";

export interface eventDetailsDto {
  eventid: number;
  event_name: string;
  description: string;
  image: string;
  status: boolean;
}

export interface eventStatusDto {
  eventid: number;
  status: boolean;
}

export const eventDtoValidation = Joi.object({
  event_name: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string().required(),
  status: Joi.boolean().optional(),
});

export const updateEventValidation = Joi.object({
  eventid: Joi.number().required(),
  event_name: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string().required(),
  status: Joi.boolean().optional(),
});

export const deleteEventValidation = Joi.object({
  event_name: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string().required(),
  status: Joi.boolean().optional(),
});

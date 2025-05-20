import { appSource } from "../../core/db";
import { HttpException, ValidationException } from "../../core/exception";
import { eventDetailsDto, eventDtoValidation, eventStatusDto, updateEventValidation } from "./event.dto";
import { events } from "./event.model";
import { Request, Response } from "express";

export const addNewEvent = async (req: Request, res: Response) => {
  const payload: eventDetailsDto = req.body;
  console.log(payload, "payload");
  try {
    const EventRepository = appSource.getRepository(events);
    if (payload.eventid) {
      console.log("came nto update");
      const validation = updateEventValidation.validate(payload);
      if (validation?.error) {
        throw new ValidationException(validation.error.message);
      }
      const eventDetails = await EventRepository.findOneBy({
        eventid: payload.eventid,
      });
      if (!eventDetails?.eventid) {
        throw new ValidationException("event not found");
      }
      const { eventid, ...updatePayload } = payload;
      await EventRepository.update(
        { eventid: payload.eventid },
        updatePayload
      );
      res.status(200).send({
        IsSuccess: "event Details updated SuccessFully",
      });
      return;
    }

    const existingEvent = await EventRepository.findOneBy({
      event_name: payload.event_name,
    });
    if (existingEvent) {
      throw new ValidationException("event name already exists");
    }

    const validation = eventDtoValidation.validate(payload);
    if (validation?.error) {
      throw new ValidationException(validation.error.message);
    }
    const { eventid, ...updatePayload } = payload;
    await EventRepository.save(updatePayload);
    res.status(200).send({
      IsSuccess: "event Details added SuccessFully",
    });
  } catch (error) {
    console.log(error, "error");
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error.message,
      });
    }
    res.status(500).send({ message: "Internal server error" });
  }
};

export const getEventDetails = async (req: Request, res: Response) => {
  try {
    const Repository = appSource.getRepository(events);
    const eventList = await Repository.createQueryBuilder().getMany();

    res.status(200).send({
      Result: eventList,
    });
  } catch (error) {
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error?.message,
      });
    }
    res.status(500).send(error);
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  const id = req.params.eventid;
  console.log("Received Event ID:", id);
  const eventRepo = appSource.getRepository(events);
  try {
    const typeNameFromDb = await eventRepo
      .createQueryBuilder("EventDetails")
      .where("EventDetails.eventid = :eventid", {
        eventid: id,
      })
      .getOne();
    if (!typeNameFromDb?.eventid) {
      throw new HttpException("event not Found", 400);
    }
    await eventRepo
      .createQueryBuilder("EventDetails")
      .delete()
      .from(events)
      .where("eventid = :eventid", { eventid: id })
      .execute();
    res.status(200).send({
      IsSuccess: `event deleted successfully!`,
    });
  } catch (error) {
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error?.message,
      });
    }
    res.status(500).send(error);
  }
};

export const changeStatusEvent = async (req: Request, res: Response) => {
  const status: eventStatusDto = req.body;
  const EventRepository = appSource.getRepository(events);
  const details = await EventRepository.findOneBy({
    eventid: Number(status.eventid),
  });
  try {
    if (!details) throw new HttpException("bannerDetails not Found", 400);
    await EventRepository.createQueryBuilder()
      .update(events)
      .set({ status: status.status })
      .where({ eventid: Number(status.eventid) })
      .execute();
    res.status(200).send({
      IsSuccess: `Status for Event ${details.event_name} Updated successfully!`,
    });
  } catch (error) {
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error?.message,
      });
    }
    res.status(500).send(error);
  }
};
import { Not } from "typeorm";
import { appSource } from "../../core/db";
import { HttpException, ValidationException } from "../../core/exception";
import { eventDetailsDto, eventDtoValidation, eventStatusDto, updateEventValidation } from "./event.dto";
import { events } from "./event.model";
import { Request, Response } from "express";
import { LogsDto } from "../logs/logs.dto";
import { InsertLog } from "../logs/logs.service";

export const addNewEvent = async (req: Request, res: Response) => {
  const payload: eventDetailsDto = req.body;
  const userId = payload.eventid ? payload.muid : payload.cuid;
  try {
    const EventRepository = appSource.getRepository(events);
    if (payload.eventid) {
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
      const existingProduct = await EventRepository.findOne({
        where: {
          event_name: payload.event_name,
          eventid: Not(payload.eventid),
        },
      });

      if (existingProduct) {
        throw new ValidationException("Product name already exists");
      }

      const { eventid, ...updatePayload } = payload;
      await EventRepository.update(
        { eventid: payload.eventid },
        updatePayload
      );
      const logsPayload: LogsDto = {
        userId: userId,
        userName: '',
        statusCode: 200,
        message: `Event ${payload.event_name} updated by -`
      }
      await InsertLog(logsPayload);
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
    const logsPayload: LogsDto = {
      userId: userId,
      userName: '',
      statusCode: 200,
      message: `Event ${payload.event_name} added by -`
    }
    await InsertLog(logsPayload);
    res.status(200).send({
      IsSuccess: "event Details added SuccessFully",
    });

  } catch (error) {
    const logsPayload: LogsDto = {
      userId: userId,
      userName: '',
      statusCode: 500,
      message: `Error while saving Event ${payload.event_name} by -`
    }
    await InsertLog(logsPayload);
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
  const userId = Number(req.params.userId);
  const eventRepo = appSource.getRepository(events);

  const typeNameFromDb = await eventRepo
    .createQueryBuilder("EventDetails")
    .where("EventDetails.eventid = :eventid", {
      eventid: id,
    })
    .getOne();
  if (!typeNameFromDb?.eventid) {
    throw new HttpException("event not Found", 400);
  }
  try {

    await eventRepo
      .createQueryBuilder("EventDetails")
      .delete()
      .from(events)
      .where("eventid = :eventid", { eventid: id })
      .execute();

    const logsPayload: LogsDto = {
      userId: userId,
      userName: '',
      statusCode: 200,
      message: `Event ${typeNameFromDb.event_name} deleted by -`
    }
    await InsertLog(logsPayload);
    res.status(200).send({
      IsSuccess: `event deleted successfully!`,
    });
  } catch (error) {
    const logsPayload: LogsDto = {
      userId: userId,
      userName: '',
      statusCode: 500,
      message: `Error while deleting Event ${typeNameFromDb.event_name}  by -`
    }
    await InsertLog(logsPayload);
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
  if (!details) throw new HttpException("bannerDetails not Found", 400);

  try {
    await EventRepository.createQueryBuilder()
      .update(events)
      .set({ status: status.status })
      .where({ eventid: Number(status.eventid) })
      .execute();
    const logsPayload: LogsDto = {
      userId: Number(status.userId),
      userName: '',
      statusCode: 200,
      message: `Event ${details.event_name} status changed to ${status.status} by -`
    }
    await InsertLog(logsPayload);

    res.status(200).send({
      IsSuccess: `Status for Event ${details.event_name} Updated successfully!`,
    });
  } catch (error) {
    const logsPayload: LogsDto = {
      userId: Number(status.userId),
      userName: '',
      statusCode: 500,
      message: `Error while changing status for Event ${details.event_name}  to ${status.status} by -`
    }
    await InsertLog(logsPayload);
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error?.message,
      });
    }
    res.status(500).send(error);
  }
};
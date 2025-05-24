import { appSource } from "../../core/db";
import { HttpException, ValidationException } from "../../core/exception";
import { Request, Response } from "express";
import {
  applicationDto,
  applicationUpdateValidation,
  applicationValidate,
} from "./application.dto";
import { application } from "./application.model";
import { currentOpenings } from "../currentOpenings/currentOpenings.model";

export const newApplication = async (req: Request, res: Response) => {
  const payload: applicationDto = req.body;
  try {
    const Repoistry = appSource.getRepository(application);

    const validation = applicationValidate.validate(payload);
    if (validation?.error) {
      throw new ValidationException(validation.error.message);
    }
    // const UserDetailsRepoistry = appSource.getRepository(UserDetails);

    const { application_id, ...updatePayload } = payload;
    await Repoistry.save(updatePayload);

    // update no of applied
    const currentOpeningsRepoistry = appSource.getRepository(currentOpenings);
    const currentOpeningsDetails = await currentOpeningsRepoistry.findOneBy({
      id: payload.jobtitle,
    });
    if (!currentOpeningsDetails?.id) {
      throw new ValidationException("Opening Details not found");
    }
    const alreadyAppliedCount = currentOpeningsDetails.noOfApplied || 0;
    const uppdatedCount = alreadyAppliedCount + 1;
    await currentOpeningsRepoistry
      .createQueryBuilder()
      .update(currentOpenings)
      .set({ noOfApplied: uppdatedCount })
      .where({ id: payload.jobtitle })
      .execute();

    res.status(200).send({
      IsSuccess: "User Details added SuccessFully",
    });
  } catch (error) {
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error.message, // Ensure the error message is sent properly
      });
    }
    res.status(500).send({ message: "Internal server error" });
  }
};

export const getPersonDetails = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const Repository = appSource.getRepository(application);

    const Data = await Repository.createQueryBuilder()
      .where("application.jobtitle =:id", {
        id: id,
      })
      .getMany();
    res.status(200).send({
      Result: Data,
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

export const getPersonDetail = async (req: Request, res: Response) => {
  const id = req.params.applicationid;
  try {
    const Repository = appSource.getRepository(application);

    const Data = await Repository.createQueryBuilder()
      .where("application.application_id =:id", {
        id: id,
      })
      .getOne();
    res.status(200).send({
      Result: Data,
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

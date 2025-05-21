import { appSource } from "../../core/db";
import { HttpException, ValidationException } from "../../core/exception";
import { Request, Response } from "express";
import { applicationDto, applicationUpdateValidation, applicationValidate } from "./application.dto";
import { application } from "./Application.model";



export const newApplication = async (req: Request, res: Response) => {
  const payload: applicationDto = req.body;
  try {
    const Repoistry = appSource.getRepository(application);
      if (payload.application_id) {
           const validation = applicationUpdateValidation.validate(payload);
           if (validation?.error) {
             throw new ValidationException(validation.error.message);
           }
           const userDetails = await  Repoistry .findOneBy({
            application_id: payload.application_id,
           });
           if (!userDetails?.application_id) {
             throw new ValidationException("user details  not found");
           }
           const { cuid, application_id, ...updatePayload } = payload;
           await  Repoistry .update({ application_id: payload.application_id }, updatePayload);
           res.status(200).send({
             IsSuccess: "user  Details updated SuccessFully",
           });
           return;
         }

    const validation = applicationValidate.validate(payload);
    if (validation?.error) {
      throw new ValidationException(validation.error.message);
    }
    // const UserDetailsRepoistry = appSource.getRepository(UserDetails);

    const validateTypeName = await  Repoistry .findBy({
      mail_id: payload.mail_id,
    });
    if (validateTypeName?.length) {
      throw new ValidationException("Email already exist");
    }
    const { application_id, ...updatePayload } = payload;
    await Repoistry.save(updatePayload);
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

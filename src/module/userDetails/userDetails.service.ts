import { appSource } from "../../core/db";
import { HttpException, ValidationException } from "../../core/exception";
import { userDetailsDto, userDetailsValidation } from "./userDetails.dto";
import { Request, Response } from "express";
import { UserDetails } from "./userDetails.model";

export const newUser = async (req: Request, res: Response) => {
  const payload: userDetailsDto = req.body;
  try {
    const validation = userDetailsValidation.validate(payload);
    if (validation?.error) {
      throw new ValidationException(validation.error.message);
    }
    const UserDetailsRepoistry = appSource.getRepository(UserDetails);

    const validateTypeName = await UserDetailsRepoistry.findBy({
      email: payload.email,
    });
    if (validateTypeName?.length) {
      throw new ValidationException("Email already exist");
    }
    const { userid, ...updatePayload } = payload;
    await UserDetailsRepoistry.save(updatePayload);
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


export const getUser = async (req: Request, res: Response) => {
  try {
      const Repository = appSource.getRepository(UserDetails);
      const userList = await Repository
          .createQueryBuilder()
          .getMany();
      res.status(200).send({
          Result: userList
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

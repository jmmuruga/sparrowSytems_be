import { appSource } from "../../core/db";
import { HttpException, ValidationException } from "../../core/exception";
import { userDetailsDto, userDetailsUpadteValidation, userDetailsValidation } from "./userDetails.dto";
import { Request, Response } from "express";
import { UserDetails } from "./userDetails.model";

export const newUser = async (req: Request, res: Response) => {
  const payload: userDetailsDto = req.body;
  try {
    const UserDetailsRepoistry = appSource.getRepository(UserDetails);
      if (payload.userid) {
           const validation = userDetailsUpadteValidation.validate(payload);
           if (validation?.error) {
             throw new ValidationException(validation.error.message);
           }
           const userDetails = await UserDetailsRepoistry.findOneBy({
            userid: payload.userid,
           });
           if (!userDetails?.userid) {
             throw new ValidationException("user details  not found");
           }
           const { cuid, userid, ...updatePayload } = payload;
           await UserDetailsRepoistry.update({ userid: payload.userid }, updatePayload);
           res.status(200).send({
             IsSuccess: "user  Details updated SuccessFully",
           });
           return;
         }

    const validation = userDetailsValidation.validate(payload);
    if (validation?.error) {
      throw new ValidationException(validation.error.message);
    }
    // const UserDetailsRepoistry = appSource.getRepository(UserDetails);

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

export const deleteUser = async (req: Request, res: Response) => {
  const id = req.params.userid;
  const userRepo = appSource.getRepository(UserDetails);
  try {
      const typeNameFromDb = await userRepo
          .createQueryBuilder('UserDetails')
          .where("UserDetails.userid = :userid", {
              userid: id,
          })
          .getOne();
      if (!typeNameFromDb?.userid) {
          throw new HttpException("User not Found", 400);
      }
      await userRepo
          .createQueryBuilder("UserDetails")
          .delete()
          .from(UserDetails)
          .where("userid = :userid", { userid: id })
          .execute();
      res.status(200).send({
          IsSuccess: `User deleted successfully!`,
      });
  }
  catch (error) {
      if (error instanceof ValidationException) {
          return res.status(400).send({
              message: error?.message,
          });
      }
      res.status(500).send(error);
  }
}
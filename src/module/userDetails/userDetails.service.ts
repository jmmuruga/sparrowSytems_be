import { appSource } from "../../core/db";
import { HttpException, ValidationException } from "../../core/exception";
import { userDetailsDto, userDetailsUpadteValidation, userDetailsValidation } from "./userDetails.dto";
import { Request, Response } from "express";
import { UserDetails } from "./userDetails.model";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";


export const newUser = async (req: Request, res: Response) => {
  const payload: userDetailsDto = req.body;
  try {
     const hashedPassword = await bcrypt.hash(payload.password, 10);
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
           const { cuid, userid,password, ...updatePayload } = payload;
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
    const { userid,password, ...updatePayload } = payload;
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

export const updatePassword = async (req: Request, res: Response) => {
  const { userid, password } = req.body;

  try {
    const userRepo = appSource.getRepository(UserDetails);
    const user = await userRepo.findOneBy({ userid });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.password = password;
    user.confirmPassword = password;

    await userRepo.save(user);

    return res.json({ message: 'Password updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};


export const sendOtpInEmail = async(req : Request , res : Response) =>{
  try{
     const payload: UserDetails = req.body;
     const newlyGeneratedOtp = generateOpt();

     const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: false,
      auth: {
        user: "savedatain@gmail.com",
        pass: "unpk bcsy ibhp wzrm",
      },
    });

    let response = await transporter.sendMail({
      from: payload.email,
      to: "savedatain@gmail.com",
      subject:'new user sign in ',
      text:`Please enter the OTP: ${newlyGeneratedOtp} to new user.`
    });

    res.status(200).send({
      Result : newlyGeneratedOtp
    })

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


export function generateOpt(): string {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
}


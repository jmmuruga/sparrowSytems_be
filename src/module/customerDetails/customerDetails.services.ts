import { appSource } from "../../core/db";
import { HttpException, ValidationException } from "../../core/exception";
import { Request, Response } from "express";
import {
  customerDetailsDto,
  customerDetailsUpdateValidation,
  customerDetailsValiadtion,
} from "./customerDetails.dto";
import { customerDetails } from "./customerDetails.model";
import nodemailer from "nodemailer";

import dotenv from "dotenv";
const jwt = require("jsonwebtoken");

dotenv.config(); // Ensure env variables are loaded

// Utility function for error handling
const handleError = (res: Response, error: any) => {
 
  if (error instanceof ValidationException) {
    return res.status(400).send({ message: error.message });
  }
  res.status(500).send({ message: "Internal server error" });
};

export const newCustomer = async (req: Request, res: Response) => {
  const payload: customerDetailsDto = req.body;
  try {
    const customerDetailsRepoistry = appSource.getRepository(customerDetails);
    if (payload.customerid) {
      const validation = customerDetailsUpdateValidation.validate(payload);
      if (validation?.error) {
        throw new ValidationException(validation.error.message);
      }
      const customerDetails = await customerDetailsRepoistry.findOneBy({
        customerid: payload.customerid,
      });
      if (!customerDetails?.customerid) {
        throw new ValidationException("customer details not found");
      }

      const { cuid, customerid, ...updatePayload } = payload;
      await customerDetailsRepoistry.update(
        { customerid: payload.customerid },
        updatePayload
      );
      res.status(200).send({
        IsSuccess: "customer   Details updated SuccessFully",
      });
      return;
    }

    const validation = customerDetailsValiadtion.validate(payload);
    if (validation?.error) {
      throw new ValidationException(validation.error.message);
    }

    const validateEmail = await customerDetailsRepoistry.findBy({
      email: payload.email,
    });
    if (validateEmail?.length) {
      throw new ValidationException("Email already exist");
    }
    const validateMobile = await customerDetailsRepoistry.findBy({
      mobilenumber: payload.mobilenumber,
    });
    if (validateMobile.length) {
      throw new ValidationException("mobilenumber already exist");
    }

    const { customerid, ...updatePayload } = payload;
    await customerDetailsRepoistry.save(updatePayload);
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

export const Userlogin = async (req: Request, res: Response) => {
  const payload: { emailorMobile: string; password: string } = req.body;
  let isLogInSucces: boolean;
  try {
    const customerDetailsRepo = appSource.getRepository(customerDetails);

    let loginCustomerDetails;

    const checkEmailExist = await customerDetailsRepo.findOneBy({
      email: payload.emailorMobile,
    });

    if (checkEmailExist) {
      loginCustomerDetails = checkEmailExist;
      if (checkEmailExist.password == payload.password) {
        isLogInSucces = true;
      } else {
        throw new ValidationException("Wrong Password");
      }
    }

    if (!checkEmailExist) {
      const checkMobExist = await customerDetailsRepo.findOneBy({
        mobilenumber: payload.emailorMobile,
      });

      if (checkMobExist) {
        loginCustomerDetails = checkMobExist;
        if (checkMobExist.password == payload.password) {
          isLogInSucces = true;
        } else {
          throw new ValidationException("Wrong Password");
        }
      }

      if (!checkMobExist) {
        throw new ValidationException("No Customer Found");
      }
      if (!loginCustomerDetails) {
        throw new ValidationException("Invalid email/mobile or password");
      }

      // Generate token

     
    }
    res.status(200).send({
      message: "Login successful",
      // Ensure token is explicitly assigned
      customer: loginCustomerDetails,
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

export const getCustomer = async (req: Request, res: Response) => {
  try {
    const Repository = appSource.getRepository(customerDetails);
    const customerList = await Repository.createQueryBuilder().getMany();
    res.status(200).send({
      Result: customerList,
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

export const deleteCustomer = async (req: Request, res: Response) => {
  const id = req.params.customerid;
  const customerRepo = appSource.getRepository(customerDetails);
  try {
    const typeNameFromDb = await customerRepo
      .createQueryBuilder("customerDetails")
      .where("customerDetails.customerid = :customerid", {
        customerid: id,
      })
      .getOne();
    if (!typeNameFromDb?.customerid) {
      throw new HttpException("User not Found", 400);
    }
    await customerRepo
      .createQueryBuilder("customerDetails")
      .delete()
      .from(customerDetails)
      .where("customerid = :customerid", { customerid: id })
      .execute();
    res.status(200).send({
      IsSuccess: `User deleted successfully!`,
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

export const requestPasswordReset = async (req: Request, res: Response) => {
  const { email } = req.params;
 

  try {
    const customerDetailsRepo = appSource.getRepository(customerDetails);
    const customer = await customerDetailsRepo.findOneBy({ email: email });

    if (!customer) {
      throw new ValidationException("invalid email");
    }
    res.status(200).send({
      Result: customer,
      message: "password updated succesfully",
      // email: customer.email
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

export const sendOtpInEmail = async(req : Request , res : Response) =>{
  try{
     const payload: customerDetailsDto = req.body;
     console.log(payload,"helo")

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
      from: "savedatain@gmail.com",
      to: payload.email,
      subject: 'Create a new customer',
      text:`Please enter the OTP: ${newlyGeneratedOtp} to create a customer.`
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



export const resendPasswordOtp  = async (req:Request,res:Response) => {
  try{

    const email = req.params.email;
    console.log
    const otpGenerate = generateOpt();
    const repo = appSource.getRepository(customerDetails);
    const isEmail  = await repo.findOneBy({ email: email });
    if (!isEmail){
        throw new ValidationException("invalid email");
    }
   if(isEmail){

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
      from: "savedatain@gmail.com",
      to: email,
      subject: 'Create a new customer',
      text:`Please enter the OTP: ${ otpGenerate} to change the forgot password.`
    });

    res.status(200).send({
      Result :otpGenerate
    })


   }

  } 
  catch (error){
      handleError(res, error);

  }

}

export function generateOpt(): string {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
}




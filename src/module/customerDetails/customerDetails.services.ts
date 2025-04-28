import { appSource } from "../../core/db";
import { HttpException, ValidationException } from "../../core/exception";
import { Request, Response } from "express";
import { customerDetailsDto, customerDetailsUpdateValidation, customerDetailsValiadtion } from "./customerDetails.dto";
import { customerDetails } from "./customerDetails.model";


export const newCustomer =  async (req: Request, res:Response)=>{
   const payload:customerDetailsDto = req.body;
   try{
     const customerDetailsRepoistry = appSource.getRepository(customerDetails);
     if(payload.customerid){
        const validation = customerDetailsUpdateValidation.validate(payload)
        if (validation?.error){
            throw new ValidationException(validation.error.message)

        }
        const customerDetails = await customerDetailsRepoistry.findOneBy({
            customerid: payload.customerid,
        })
        if(!customerDetails?.customerid){
            throw new ValidationException("customer details not found")
        }

        const {cuid,customerid,...updatePayload} = payload;
        await customerDetailsRepoistry.update({customerid: payload.customerid},updatePayload)
        res.status(200).send({
            IsSuccess: "customer   Details updated SuccessFully",
     }); return;
    }

    const validation = customerDetailsValiadtion.validate(payload)
    if(validation?.error){
        throw new ValidationException(validation.error.message)
    }

    const validateEmail = await customerDetailsRepoistry.findBy({
        email:payload.email
    })
    if(validateEmail?.length){
        throw new ValidationException("Email already exist")
    }
  const validateMobile = await customerDetailsRepoistry.findBy({
      mobilenumber:payload.mobilenumber
  })
  if(validateMobile.length){
      throw new ValidationException("mobilenumber already exist")
  }

   const {customerid,...updatePayload} = payload;
    await customerDetailsRepoistry.save(updatePayload)
    res.status(200).send({
        IsSuccess: "User Details added SuccessFully",
      });
}catch (error) {
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error.message, // Ensure the error message is sent properly
      });
    }
    res.status(500).send({ message: "Internal server error" });
  }
};


export const getCustomer = async (req: Request, res: Response) => {
  try {
      const Repository = appSource.getRepository(customerDetails);
      const customerList = await Repository
          .createQueryBuilder()
          .getMany();
      res.status(200).send({
          Result: customerList
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
          .createQueryBuilder('customerDetails')
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




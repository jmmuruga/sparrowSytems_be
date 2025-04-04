import { appSource } from "../../core/db";
import { HttpException, ValidationException } from "../../core/exception";
import { brandDto, brandValidation } from "./brand.dto";
import { Request, Response } from "express";
import { BrandDetail } from "./brand.model";


export const addBrand = async (req: Request, res: Response) => {
  const payload: brandDto = req.body;
  try {
    const validation = brandValidation.validate(payload);
    if (validation?.error) {
      throw new ValidationException(validation.error.message);
    }
    const BrandRepository = appSource.getRepository(BrandDetail);
  


    // Check if email already exists
    const validateTypeName = await BrandRepository.findBy({
      email: payload.email,
    });
    if (validateTypeName?.length) {
      throw new ValidationException("Email already exist");
    }
    const { brandid, ...updatePayload } = payload;
    await BrandRepository.save(updatePayload);
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





// export const updateBrand = async (req: Request, res: Response) => {
//   const payload: brandDto = req.body;

//   try {
//     const validation = brandValidation.validate(payload);
//     if (validation?.error) {
//       throw new ValidationException(validation.error.message);
//     }

//     const BrandRepository = appSource.getRepository(BrandDetail);

//     // Check if the brand exists
//     const brand = await BrandRepository.findOneBy({
//       brandid: payload.brandid,
//     });

//     if (!brand) {
//       throw new ValidationException("Brand not found");
//     }

//     // If email is being changed, check for duplicates
//     // if (payload.email !== brand.email) {
//     //   const emailExists = await BrandRepository.findBy({ email: payload.email });
//     //   if (emailExists.length > 0) {
//     //     throw new ValidationException("Email already exists");
//     //   }
//     // }

//     const { brandid, cuid, ...updatePayload } = payload;

//     await BrandRepository.update({ brandid: payload.brandid }, updatePayload);

//     res.status(200).send({
//       IsSuccess: "User Details updated successfully",
//     });

//   } catch (error) {
//     if (error instanceof ValidationException) {
//       return res.status(400).send({
//         message: error.message,
//       });
//     }

//     res.status(500).send({
//       message: "Internal server error",
//     });
//   }
// };





export const getBrandDetail = async (req: Request, res: Response) => {
  try {
      const Repository = appSource.getRepository(BrandDetail);
      
      const brandList = await Repository
          .createQueryBuilder()
          .getMany();
      res.status(200).send({
          Result: brandList
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
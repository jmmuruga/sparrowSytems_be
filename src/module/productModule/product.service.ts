import { appSource } from "../../core/db";
import { HttpException, ValidationException } from "../../core/exception";
import { Request, Response } from "express";
import { productDetailsDto, productDetailsValidation, updateDetailsValidation } from "./product.dto";
import { products } from "./product.model";



// export const addProduct = async (req: Request, res: Response) => {
//     try {
//         const payload: productDetailsDto = req.body;
//        console.log("called" );
//        const validation = productDetalsValidation.validate(payload);
//         if (validation.error) {
//             console.warn("❌ Validation error:", validation.error.message);
//             throw new ValidationException(validation.error.message);
//         }
//         const productRepoisry = appSource.getRepository(products);
//         await productRepoisry.save(payload)
//         return res.status(200).send({ IsSuccess: "Product added successfully" });
//     } catch (error) {
//         if (error instanceof ValidationException) {
//             return res.status(400).json({ success: false, message: error.message });
//         }

//         // Log all other unexpected errors
//         console.error("🔥 Unexpected error while adding product:", error);
//         return res.status(500).json({ success: false, message: "Internal server error" });
//     }
// };

export const addProducts = async (req: Request, res: Response) => {
    const payload: productDetailsDto = req.body;
    try {
      const BrandRepository = appSource.getRepository(products);
      if(payload.productid){
        console.log('came nto update')
        const validation = updateDetailsValidation.validate(payload);
        if (validation?.error) {
          throw new ValidationException(validation.error.message);
        }
        const brandDetails  = await BrandRepository.findOneBy({
          productid : payload.productid
        });
        if(!brandDetails?.productid){
          throw new ValidationException("Brand not found");
        }
        const { cuid, productid, ...updatePayload } = payload;
        await BrandRepository.update({ productid: payload.productid }, updatePayload);
        res.status(200).send({
          IsSuccess: "Brand Details updated SuccessFully",
        });
        return;
      }
      const validation = productDetailsValidation.validate(payload);
      if (validation?.error) {
        throw new ValidationException(validation.error.message);
      }
      const { productid, ...updatePayload } = payload;
      await BrandRepository.save(updatePayload);
      res.status(200).send({
        IsSuccess: "Brand Details added SuccessFully",
      });
    } catch (error) {
      console.log(error , 'error')
      if (error instanceof ValidationException) {
        return res.status(400).send({
          message: error.message,
        });
      }
      res.status(500).send({ message: "Internal server error" });
    }
};
  
export const getProductsDetails = async (req: Request, res: Response) => {
    try {
        const Repository = appSource.getRepository(products);
        const productList = await Repository
            .createQueryBuilder()
            .getMany();
        res.status(200).send({
            Result: productList
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

export const deleteProduct = async (req: Request, res: Response) => {
    const id = req.params.banner_id;
    console.log("Received Brand ID:", id);
    const brandRepo = appSource.getRepository(products);
    try {
        const typeNameFromDb = await  brandRepo
            .createQueryBuilder('BrandDetail')
            .where("BrandDetail.brandid = :brandid", {
                brandid: id,
            })
            .getOne();
        if (!typeNameFromDb?.productid) {
            throw new HttpException("brand not Found", 400);
        }
        await  brandRepo
            .createQueryBuilder("BrandDetail")
            .delete()
            .from(products)
            .where("brandid = :brandid", { brandid: id })
            .execute();
        res.status(200).send({
            IsSuccess: `brand deleted successfully!`,
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


  
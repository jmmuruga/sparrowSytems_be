import { appSource } from "../../core/db";
import { HttpException, ValidationException } from "../../core/exception";
import { Request, Response } from "express";
import { productDetailsDto, productDetailsValidation, updateDetailsValidation } from "./product.dto";
import { products } from "./product.model";



// export const addProducts = async (req: Request, res: Response) => {
//     try {
//         const payload: productDetailsDto = req.body;
//        console.log("called" );
//        const validation = productDetailsValidation.validate(payload);
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
      const ProductRepository = appSource.getRepository(products);
      if(payload.productid){
        console.log('came nto update')
        const validation = updateDetailsValidation.validate(payload);
        if (validation?.error) {
          throw new ValidationException(validation.error.message);
        }
        const productDetails  = await ProductRepository.findOneBy({
          productid : payload.productid
        });
        if(!productDetails?.productid){
          throw new ValidationException("Product not found");
        }
        const { cuid, productid, ...updatePayload } = payload;
        await ProductRepository.update({ productid: payload.productid }, updatePayload);
        res.status(200).send({
          IsSuccess: "Product Details updated SuccessFully",
        });
        return;
      }
      const validation = productDetailsValidation.validate(payload);
      if (validation?.error) {
        throw new ValidationException(validation.error.message);
      }
      const { productid, ...updatePayload } = payload;
      await ProductRepository.save(updatePayload);
      res.status(200).send({
        IsSuccess: "Product Details added SuccessFully",
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
    const id = req.params.productid;
    console.log("Received product ID:", id);
    const productRepo = appSource.getRepository(products);
    try {
        const typeNameFromDb = await  productRepo
            .createQueryBuilder('ProductDetail')
            .where("ProductDetail.productid = :productid", {
                productid: id,
            })
            .getOne();
        if (!typeNameFromDb?.productid) {
            throw new HttpException("product not Found", 400);
        }
        await  productRepo
            .createQueryBuilder("ProductDetail")
            .delete()
            .from(products)
            .where("productid = :productid", { productid: id })
            .execute();
        res.status(200).send({
            IsSuccess: `product deleted successfully!`,
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
  };


//   export const changeStatusProduct = async (req: Request, res: Response) => {
//     const id = req.params.albumid;
//     const statusVal: boolean = req.params.status === 'true';
//     const repo = appSource.getRepository(products);
//     try {
//         const typeNameFromDb = await repo
//             .createQueryBuilder('ProductDetail')
//             .where("ProductDetail.productid = :productid", {
//                 albumid: id,
//             })
//             .getOne();
//         if (!typeNameFromDb?.productid) {
//             throw new HttpException("Data not Found", 400);
//         }
//         await repo
//             .createQueryBuilder()
//             .update(products)
//             .set({ status: statusVal})
//             .where({ productid: id }).execute();
//         res.status(200).send({
//             IsSuccess: `Status Updated successfully!`,
//         });
//     }
//     catch (error) {
//         if (error instanceof ValidationException) {
//             return res.status(400).send({
//                 message: error?.message,
//             });
//         }
//         res.status(500).send(error);
//     }
//   }


  
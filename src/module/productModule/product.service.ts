import { appSource } from "../../core/db";
import { HttpException, ValidationException } from "../../core/exception";
import { Request, Response } from "express";
import {
  productDetailsDto,
  productDetailsValidation,
  productStatusDto,
  updateDetailsValidation,
} from "./product.dto";
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
    if (payload.productid) {
      console.log("came nto update");
      const validation = updateDetailsValidation.validate(payload);
      if (validation?.error) {
        throw new ValidationException(validation.error.message);
      }
      const productDetails = await ProductRepository.findOneBy({
        productid: payload.productid,
      });
      if (!productDetails?.productid) {
        throw new ValidationException("Product not found");
      }
      const { cuid, productid, ...updatePayload } = payload;
      await ProductRepository.update(
        { productid: payload.productid },
        updatePayload
      );
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
    console.log(error, "error");
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
    const productList = await Repository.createQueryBuilder().getMany();
    res.status(200).send({
      Result: productList,
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
    const typeNameFromDb = await productRepo
      .createQueryBuilder("ProductDetail")
      .where("ProductDetail.productid = :productid", {
        productid: id,
      })
      .getOne();
    if (!typeNameFromDb?.productid) {
      throw new HttpException("product not Found", 400);
    }
    await productRepo
      .createQueryBuilder("ProductDetail")
      .delete()
      .from(products)
      .where("productid = :productid", { productid: id })
      .execute();
    res.status(200).send({
      IsSuccess: `product deleted successfully!`,
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

export const changeStatusProduct = async (req: Request, res: Response) => {
  const status: productStatusDto = req.body;
  const ProductRepository = appSource.getRepository(products);
  const details = await ProductRepository.findOneBy({
    productid: Number(status.productid),
  });
  try {
    if (!details) throw new HttpException("productDetails not Found", 400);
    await ProductRepository.createQueryBuilder()
      .update(products)
      .set({ status: status.status })
      .where({ productid: Number(status.productid) })
      .execute();
    res.status(200).send({
      IsSuccess: `Status for product ${details.product_name} Updated successfully!`,
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

export const getRecentOffers = async (req: Request, res: Response) => {
  try {
    const ProductRepository = appSource.getRepository(products);
    const details: productDetailsDto[] = await ProductRepository.query(
      `  SELECT TOP 5  
    productid,
    product_name,
    stock,
    brand_name,
    category_name,
    mrp,
    discount,
    offer_price,
    min_qty,
    max_qty,
    delivery_charges,
    delivery_amount,
    variation_group,
    description,
    terms,
    delivery_days,
    warranty,
    document,
    image1,
    image2,
    image3,
    image4,
    image5,
    image6,
    image7,
    cuid,
    muid,
    created_at,
    updated_at,
    status
FROM [${process.env.DB_name}].[dbo].[products]
WHERE [offer_price] IS NOT NULL
ORDER BY [updated_at] DESC;`
    );
    res.status(200).send({ Result: details });
  } catch (error) {
    console.log(error);
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error?.message,
      });
    }
    res.status(500).send(error);
  }
};

export const getNewProducts = async (req: Request, res: Response) => {
  try {
    const ProductRepository = appSource.getRepository(products);
    const details: productDetailsDto[] = await ProductRepository.query(
      `  SELECT TOP 15
    [productid],
    [product_name],
    [stock],
    [brand_name],
    [category_name],
    [mrp],
    [discount],
    [offer_price],
    [min_qty],
    [max_qty],
    [delivery_charges],
    [delivery_amount],
    [variation_group],
    [description],
    [terms],
    [delivery_days],
    [warranty],
    [document],
    [image1],
    [image2],
    [image3],
    [image4],
    [image5],
    [image6],
    [image7],
    [cuid],
    [muid],
    [created_at],
    [updated_at],
    [status]
FROM [SPARROW_SYSTEMS].[dbo].[products]
ORDER BY [created_at] DESC;`
    );
    res.status(200).send({ Result: details });
  } catch (error) {
    console.log(error);
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error?.message,
      });
    }
    res.status(500).send(error);
  }
};

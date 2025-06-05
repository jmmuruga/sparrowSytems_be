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
import { Category } from "../categorymodule/category.model";

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

    const existingProduct = await ProductRepository.findOneBy({
      product_name: payload.product_name,
    });
    if (existingProduct) {
      throw new ValidationException("Product name already exists");
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
    const productList: productDetailsDto[] =
      await Repository.createQueryBuilder().getMany();
    const categoryRepoistry = appSource.getRepository(Category);
    const categoryList = await categoryRepoistry.createQueryBuilder().getMany();
    productList.forEach((x) => {
      x.categoryName = categoryList.find(
        (y) => y.categoryid === +x.category_name
      )?.categoryname;
    });
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

// export const getRecentOffers = async (req: Request, res: Response) => {
//   try {
//     const ProductRepository = appSource.getRepository(products);
//     const details: productDetailsDto[] = await ProductRepository.query(
//       `  SELECT TOP 5  
//     productid,
//     product_name,
//     mrp,
//     discount,
//     offer_price,
//     image1,
//     created_at,
//     status
// FROM [${process.env.DB_name}].[dbo].[products]
// WHERE [offer_price] IS NOT NULL
// ORDER BY [updated_at] DESC;`
//     );
//     res.status(200).send({ Result: details });
//   } catch (error) {
//     console.log(error);
//     if (error instanceof ValidationException) {
//       return res.status(400).send({
//         message: error?.message,
//       });
//     }
//     res.status(500).send(error);
//   }
// };

// export const getNewProducts = async (req: Request, res: Response) => {
//   try {
//     const ProductRepository = appSource.getRepository(products);
//     const details: productDetailsDto[] = await ProductRepository.query(
//       `  SELECT TOP 15
//     productid,
//     product_name,
//     mrp,
//     discount,
//     offer_price,
//     image1,
//     created_at,
//     status
// FROM [${process.env.DB_name}].[dbo].[products]
// ORDER BY [created_at] DESC;`
//     );
//     res.status(200).send({ Result: details });
//   } catch (error) {
//     console.log(error);
//     if (error instanceof ValidationException) {
//       return res.status(400).send({
//         message: error?.message,
//       });
//     }
//     res.status(500).send(error);
//   }
// };

// export const getLatestUpdatedCategory = async (req: Request, res: Response) => {
//   try {
//     const ProductRepository = appSource.getRepository(products);
//     const details: any[] = await ProductRepository.query(
//       ` SELECT TOP 2 
//     ranked.productid,
//     ranked.product_name,
//     ranked.mrp,
//     ranked.discount,
//     ranked.offer_price,
//     ranked.image1,
//     ranked.status,
//     category.categoryname AS categoryFullName,
//     ranked.category_name as categoryId
// FROM (
//     SELECT 
//         *,
//         CAST(updated_at AS DATE) AS updated_date,
//         ROW_NUMBER() OVER (
//             PARTITION BY category_name 
//             ORDER BY CAST(updated_at AS DATE) DESC
//         ) AS rn
//     FROM  [${process.env.DB_name}].[dbo].[products]
//     WHERE category_name IS NOT NULL
// ) AS ranked
// INNER JOIN  [${process.env.DB_name}].[dbo].[category] category 
//     ON category.categoryid = ranked.category_name
// WHERE ranked.rn = 1
// ORDER BY ranked.updated_date DESC`
//     );

//     let categoryList: any[] = [];

//     for (const x of details) {
//       const productsOfCategory = await ProductRepository.query(
//         `select top 5 * from products  where category_name  = '${x.categoryId}'
//          order by  updated_at DESC;`
//       );
//       categoryList.push(...productsOfCategory);
//     }
//     res.status(200).send({ Result: details, categoryList: categoryList });
//   } catch (error) {
//     console.log(error);
//     if (error instanceof ValidationException) {
//       return res.status(400).send({
//         message: error?.message,
//       });
//     }
//     res.status(500).send(error);
//   }
// };

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
import { orders } from "../ordersModule/orders.model";

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
  } catch (error) 
  {
    console.error("Error while adding/updating product:", error);
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error.message,
      });
    }
    res.status(500).send({ message: "Internal server error" });
  }
};

// export const getProductsDetails = async (req: Request, res: Response) => {
//   try {
//     const Repository = appSource.getRepository(products);
//     const productList: productDetailsDto[] =
//       await Repository.createQueryBuilder().getMany();
//     const categoryRepoistry = appSource.getRepository(Category);
//     const categoryList = await categoryRepoistry.createQueryBuilder().getMany();
//     productList.forEach((x) => {
//       x.categoryName = categoryList.find(
//         (y) => y.categoryid === +x.category_name
//       )?.categoryname;
//     });
//     res.status(200).send({
//       Result: productList,
//     });
//   } catch (error) {
//     if (error instanceof ValidationException) {
//       return res.status(400).send({
//         message: error?.message,
//       });
//     }
//     res.status(500).send(error);
//   }
// };

export const getProductsDetails = async (req: Request, res: Response) => {
  try {
    // Run your raw SQL query using appSource.query()
    const productList: any[] = await appSource.query(`
      SELECT 
          p.productid,
          p.product_name,
          p.stock,
          p.brand_name,
          p.category_name,
          p.mrp,
          p.discount,
          p.offer_price,
          p.min_qty,
          p.max_qty,
          p.delivery_charges,
          p.delivery_amount,
          p.variation_group,
          STUFF((
              SELECT ', ' + v2.name
              FROM [${process.env.DB_name}].[dbo].[variation] v2
              WHERE v2.variationGroup = p.variation_group
              FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), 1, 2, '') AS variation_names,
          p.description,
          p.terms,
          p.warranty,
          p.image1,
          p.image2,
          p.image3,
          p.image4,
          p.image5,
          p.image6,
          p.image7,
          p.cuid,
          p.muid,
          p.created_at,
          p.updated_at,
          p.status,
          p.delivery_days,
          p.document
      FROM 
          [${process.env.DB_name}].[dbo].[products] p;
    `);

    // Category mapping logic remains the same
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
  const productid = Number(req.params.productid);

  if (Number.isNaN(productid)) {
    return res.status(400).send({ message: "Invalid product ID" });
  }

  const productRepo = appSource.getRepository(products);
  const orderItemRepo = appSource.getRepository(orders); // ✅ Use the correct table

  try {
    // ✅ Check if product is used in any order items
    const existingOrderItems = await orderItemRepo.findBy({
      productid: productid,
    });

    if (existingOrderItems.length > 0) {
      throw new ValidationException('Unable to delete product. It is currently in use.');
    }

    // ✅ Check if product exists
    const productExists = await productRepo
      .createQueryBuilder("ProductDetail")
      .where("ProductDetail.productid = :productid", { productid })
      .getOne();

    if (!productExists) {
      throw new HttpException("Product not found", 400);
    }

    // ✅ Delete the product
    await productRepo
      .createQueryBuilder()
      .delete()
      .from(products)
      .where("productid = :productid", { productid })
      .execute();

    res.status(200).send({
      IsSuccess: `Product deleted successfully!`,
    });
  } catch (error) {
    if (error instanceof ValidationException) {
      return res.status(400).send({ message: error.message });
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
//     if (error instanceof ValidationException) {
//       return res.status(400).send({
//         message: error?.message,
//       });
//     }
//     res.status(500).send(error);
//   }
// };

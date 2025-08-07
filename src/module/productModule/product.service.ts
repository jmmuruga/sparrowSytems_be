import { appSource } from "../../core/db";
import { HttpException, ValidationException } from "../../core/exception";
import { Request, Response } from "express";
import {
  productDetailsDto,
  productDetailsValidation,
  productStatusDto,
  updateDetailsValidation,
} from "./product.dto";
import { ProductNested, products } from "./product.model";
import { Category } from "../categorymodule/category.model";
import { orders } from "../ordersModule/orders.model";
import { Not } from "typeorm";
import { CategoryNested } from "../categoryNested/categoryNested.model";
import { LogsDto } from "../logs/logs.dto";
import { InsertLog } from "../logs/logs.service";

export const addProducts = async (req: Request, res: Response) => {
  const payload: productDetailsDto & {
    images?: { image: string; image_title: string }[];
  } = req.body;
  const userId = payload.productid ? payload.muid : payload.cuid;
  try {
    const ProductRepository = appSource.getRepository(products);
    const NestedRepository = appSource.getRepository(ProductNested);

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

      const existingProduct = await ProductRepository.findOne({
        where: {
          product_name: payload.product_name,
          productid: Not(payload.productid),
        },
      });

      if (existingProduct) {
        throw new ValidationException("Product name already exists");
      }

      const { cuid, productid, images, ...updatePayload } = payload;

      await ProductRepository.update({ productid }, updatePayload);

      const logsPayload: LogsDto = {
        userId: userId,
        userName: "",
        statusCode: 200,
        message: `Product ${payload.product_name} updated by -`,
      };
      await InsertLog(logsPayload);

      if (images && images.length > 0) {
        // Remove old images
        await NestedRepository.delete({ productid });

        // Save new ones
        const newImages = images.map((img) =>
          NestedRepository.create({
            productid,
            image: img.image,
            image_title: img.image_title || "",
          })
        );
        await NestedRepository.save(newImages);
      }

      return res
        .status(200)
        .send({ IsSuccess: "Product Details updated successfully" });
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

    const { images, ...newProductData } = payload;
    const productSaved = await ProductRepository.save(newProductData);

    if (images && images.length > 0) {
      const imageEntities = images.map((img) =>
        NestedRepository.create({
          productid: productSaved.productid,
          image: img.image,
          image_title: img.image_title || "",
        })
      );
      await NestedRepository.save(imageEntities);
      const logsPayload: LogsDto = {
        userId: userId,
        userName: "",
        statusCode: 200,
        message: `Product ${payload.product_name} added by -`,
      };
      await InsertLog(logsPayload);
    }

    res.status(200).send({ IsSuccess: "Product Details added successfully" });
  } catch (error) {
    const logsPayload: LogsDto = {
      userId: userId,
      userName: "",
      statusCode: 500,
      message: `Error while saving Product ${payload.product_name} by -`,
    };
    await InsertLog(logsPayload);
    if (error instanceof ValidationException) {
      return res.status(400).send({ message: error.message });
    }
    res.status(500).send({ message: "Internal server error" });
  }
};

export const getProductsDetails = async (req: Request, res: Response) => {
  try {
    // Run your raw SQL query using appSource.query()
    const productList: any[] = await appSource.query(`
      SELECT 
    p.productid,
    p.product_name,
    p.stock,
    p.brandid,
    p.categoryid,
    p.subcategoryid,
    p.mrp,
    p.discount,
    p.offer_price,
    p.min_qty,
    p.max_qty,
    p.delivery_charges,
    p.delivery_amount,
    p.description,
    p.terms,
    p.warranty,
    p.created_at,
    p.updated_at,
    p.status,
    p.delivery_days,
    brand.brandname,
    p.document,
    (
        SELECT TOP 1 CAST(pn.image AS NVARCHAR(MAX))
        FROM [${process.env.DB_name}].[dbo].[product_nested] pn
        WHERE pn.productid = p.productid
        ORDER BY pn.id ASC
    ) AS image1,
    STUFF((
        SELECT ', ' + CAST(pn.image AS NVARCHAR(MAX))
        FROM [${process.env.DB_name}].[dbo].[product_nested] pn
        WHERE pn.productid = p.productid
        FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), 1, 2, '') AS images,
    STUFF((
        SELECT ', ' + CAST(pn.image_title AS NVARCHAR(MAX))
        FROM [${process.env.DB_name}].[dbo].[product_nested] pn
        WHERE pn.productid = p.productid
        FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), 1, 2, '') AS image_titles,
        brand.brandname as brand_name
FROM 
    [${process.env.DB_name}].[dbo].[products] p
    LEFT JOIN [${process.env.DB_name}].[DBO].[brand_detail] brand on p.brandid = brand.brandid
ORDER BY 
    p.created_at DESC
    `);

    // Category mapping logic remains the same
    const categoryRepoistry = appSource.getRepository(Category);
    const categoryList = await categoryRepoistry.createQueryBuilder().getMany();
    const subCategoryIdReposiry = appSource.getRepository(CategoryNested);
    const subCatrgeoryList = await subCategoryIdReposiry
      .createQueryBuilder()
      .getMany();

    productList.forEach((x) => {
      if (x.categoryid) {
        const ids = x.categoryid.split(",");

        // 2. Map each ID to its categoryname
        const names = ids
          .map((id: string) => {
            const found = categoryList.find((y) => y.categoryid === +id.trim());
            return found?.categoryname || "";
          })
          .filter(Boolean); // remove empty if not found

        // 3. Join back to a single string if needed
        x.categoryName = names.join(", ");
      }
      if (x.subcategoryid) {
        const subId = x.subcategoryid.split(",");

        // 2. Map each ID to its categoryname
        const names = subId
          .map((id: string) => {
            const found = subCatrgeoryList.find(
              (y) => y.subcategoryid === +id.trim()
            );
            return found?.categoryname || "";
          })
          .filter(Boolean); // remove empty if not found

        // 3. Join back to a single string if needed
        x.subCategoryName = names.join(", ");
      }
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

export const getNewAddedProductsDetails = async (
  req: Request,
  res: Response
) => {
  try {
    // Run your raw SQL query using appSource.query()
    const productList: any[] = await appSource.query(`
       SELECT 
    p.productid,
    p.product_name,
    p.stock,
    p.brandid,
    p.categoryid,
    p.subcategoryid,
    p.mrp,
    p.discount,
    p.offer_price,
    p.min_qty,
    p.max_qty,
    p.delivery_charges,
    p.delivery_amount,
    p.description,
    p.terms,
    p.warranty,
    p.created_at,
    p.updated_at,
    p.status,
    p.delivery_days,
    p.document,

    -- All image titles for this product (comma-separated)
    STUFF((
        SELECT ', ' + CAST(pn.image_title AS NVARCHAR(MAX))
        FROM [${process.env.DB_name}].[dbo].[product_nested] pn
        WHERE pn.productid = p.productid
        FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), 1, 2, '') AS image_titles,

    -- All images for this product (comma-separated)
    STUFF((
        SELECT ', ' + CAST(pn.image AS NVARCHAR(MAX))
        FROM [${process.env.DB_name}].[dbo].[product_nested] pn
        WHERE pn.productid = p.productid
        FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), 1, 2, '') AS images

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
  const userId = Number(req.params.userId);
  if (Number.isNaN(productid)) {
    return res.status(400).send({ message: "Invalid product ID" });
  }

  const productRepo = appSource.getRepository(products);
  const orderItemRepo = appSource.getRepository(orders); // ✅ Use the correct table

  // ✅ Check if product is used in any order items
  const existingOrderItems = await orderItemRepo.findBy({
    productid: productid,
  });

  if (existingOrderItems.length > 0) {
    throw new ValidationException(
      "Unable to delete product. It is currently in use."
    );
  }

  // ✅ Check if product exists
  const productExists = await productRepo
    .createQueryBuilder("ProductDetail")
    .where("ProductDetail.productid = :productid", { productid: productid })
    .getOne();

  if (!productExists) {
    throw new HttpException("Product not found", 404);
  }

  try {
    // ✅ Delete the product
    await productRepo
      .createQueryBuilder()
      .delete()
      .from(products)
      .where("productid = :productid", { productid: productid })
      .execute();

    const logsPayload: LogsDto = {
      userId: userId,
      userName: "",
      statusCode: 200,
      message: `Product ${productExists.product_name} deleted by -`,
    };
    await InsertLog(logsPayload);

    res.status(200).send({
      IsSuccess: `Product ${productExists.product_name} deleted successfully!`,
    });
  } catch (error) {
    const logsPayload: LogsDto = {
      userId: userId,
      userName: "",
      statusCode: 500,
      message: `Error while deleting Product ${productExists.product_name}  by -`,
    };
    await InsertLog(logsPayload);
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
  if (!details) throw new HttpException("productDetails not Found", 400);
  try {
    await ProductRepository.createQueryBuilder()
      .update(products)
      .set({ status: status.status })
      .where({ productid: Number(status.productid) })
      .execute();

    const logsPayload: LogsDto = {
      userId: Number(status.userId),
      userName: "",
      statusCode: 200,
      message: `Product ${details.product_name} status changed to ${status.status} by -`,
    };
    await InsertLog(logsPayload);

    res.status(200).send({
      IsSuccess: `Status for product ${details.product_name} Updated successfully!`,
    });
  } catch (error) {
    const logsPayload: LogsDto = {
      userId: Number(status.userId),
      userName: "",
      statusCode: 500,
      message: `Error while changing status for Product ${details.product_name}  to ${status.status} by -`,
    };
    await InsertLog(logsPayload);
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error?.message,
      });
    }
    res.status(500).send(error);
  }
};

export const getimages = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const imageList: any[] = await appSource.query(`
       select id, image from  [${process.env.DB_name}].[dbo].[product_Nested]
       where product_Nested.productid = '${id}'`);

    res.status(200).send({
      Result: imageList,
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

export const getProductsWithVariations = async (
  req: Request,
  res: Response
) => {
  try {
    const productList: any[] = await appSource.query(`
      SELECT 
    p.productid,
    p.product_name,
    p.stock,
    p.brandid,
    p.categoryid,
    p.subcategoryid,
    p.mrp,
    p.discount,
    p.offer_price,
    p.min_qty,
    p.max_qty,
    p.delivery_charges,
    p.delivery_amount,
    p.description,
    p.terms,
    p.warranty,
    p.created_at,
    p.updated_at,
    p.status,
    p.delivery_days,
    brand.brandname,
    p.document,

    -- First image
    (
        SELECT TOP 1 CAST(pn.image AS NVARCHAR(MAX))
        FROM [${process.env.DB_name}].[dbo].[product_nested] pn
        WHERE pn.productid = p.productid
        ORDER BY pn.id ASC
    ) AS image1,

    -- All images
    STUFF((
        SELECT ', ' + CAST(pn.image AS NVARCHAR(MAX))
        FROM [${process.env.DB_name}].[dbo].[product_nested] pn
        WHERE pn.productid = p.productid
        FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)')
    , 1, 2, '') AS images,

    -- All image titles
    STUFF((
        SELECT ', ' + CAST(pn.image_title AS NVARCHAR(MAX))
        FROM [${process.env.DB_name}].[dbo].[product_nested] pn
        WHERE pn.productid = p.productid
        FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)')
    , 1, 2, '') AS image_titles,

    -- variation_groups for this product
    STUFF((
        SELECT DISTINCT ', ' + v2.variationGroup
        FROM [${process.env.DB_name}].[dbo].[variation] v2
        WHERE v2.productid = p.productid
        FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)')
    , 1, 2, '') AS variationGroup,

    -- variation_names for all groups for this product
    STUFF((
        SELECT DISTINCT ', ' + v2.variationname
        FROM [${process.env.DB_name}].[dbo].[variation] v2
        WHERE v2.variationGroup IN (
            SELECT DISTINCT v1.variationGroup
            FROM [${process.env.DB_name}].[dbo].[variation] v1
            WHERE v1.productid = p.productid
        )
        FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)')
    , 1, 2, '') AS variation_names,

    -- variationProductId for all products in same groups
    STUFF((
        SELECT DISTINCT ', ' + CAST(v2.productid AS NVARCHAR(MAX))
        FROM [${process.env.DB_name}].[dbo].[variation] v2
        WHERE v2.variationGroup IN (
            SELECT DISTINCT v1.variationGroup
            FROM [${process.env.DB_name}].[dbo].[variation] v1
            WHERE v1.productid = p.productid
        )
        FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)')
    , 1, 2, '') AS variationProductId,

    -- brand name alias (duplicate safe)
    brand.brandname AS brand_name

FROM 
    [${process.env.DB_name}].[dbo].[products] p
    LEFT JOIN [${process.env.DB_name}].[dbo].[brand_detail] brand 
        ON p.brandid = brand.brandid
ORDER BY 
    p.created_at DESC;
 `);

    // Category mapping logic remains the same
    const categoryRepoistry = appSource.getRepository(Category);
    const categoryList = await categoryRepoistry.createQueryBuilder().getMany();
    const subCategoryIdReposiry = appSource.getRepository(CategoryNested);
    const subCatrgeoryList = await subCategoryIdReposiry
      .createQueryBuilder()
      .getMany();

    productList.forEach((x) => {
      if (x.categoryid) {
        const ids = x.categoryid.split(",");

        // 2. Map each ID to its categoryname
        const names = ids
          .map((id: string) => {
            const found = categoryList.find((y) => y.categoryid === +id.trim());
            return found?.categoryname || "";
          })
          .filter(Boolean); // remove empty if not found

        // 3. Join back to a single string if needed
        x.categoryName = names.join(", ");
      }
      if (x.subcategoryid) {
        const subId = x.subcategoryid.split(",");

        // 2. Map each ID to its categoryname
        const names = subId
          .map((id: string) => {
            const found = subCatrgeoryList.find(
              (y) => y.subcategoryid === +id.trim()
            );
            return found?.categoryname || "";
          })
          .filter(Boolean); // remove empty if not found

        // 3. Join back to a single string if needed
        x.subCategoryName = names.join(", ");
      }
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

export const getimagesForImageId = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const ProductNestedRepoistry = appSource.getRepository(ProductNested);
    const imageList: any[] = await ProductNestedRepoistry.query(`
       select id, image from  [${process.env.DB_name}].[dbo].[product_Nested]
       where product_Nested.id = ${id}`);
    res.status(200).send({
      Result: imageList,
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

export const getCategoryBasedOnBrand = async (req: Request, res: Response) => {
  const { categoryid, subcategoryid } = req.params;
  try {
    let brandList: any[] = [];
    if (Number(categoryid) > 0) {
      brandList = await appSource.query(`
    SELECT products.brandid,brand_detail.brandname
FROM [SPARROW_SYSTEMS].[dbo].[products] 
 Left join [SPARROW_SYSTEMS].[dbo].[brand_detail]  on  products.brandid = brand_detail.brandid
WHERE ',' + categoryid + ',' LIKE '%,${categoryid},%'
group by products.brandid,brand_detail.brandname;`);
    } else {
      brandList = await appSource.query(`
     SELECT products.brandid,brand_detail.brandname
FROM [SPARROW_SYSTEMS].[dbo].[products] 
 Left join [SPARROW_SYSTEMS].[dbo].[brand_detail]  on  products.brandid = brand_detail.brandid
WHERE ',' + subcategoryid + ',' LIKE '%,${subcategoryid},%'
group by products.brandid,brand_detail.brandname;`);
    }

    res.status(200).send({
      Result: brandList,
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

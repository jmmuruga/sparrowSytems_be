import { appSource } from "../../core/db";
import { Request, Response } from "express";
import { NewProductsDto, newProductsDtoValidation, updateNewProductsValidation } from "./newProducts.dto";
import { Newproducts } from "./newProducts.model";
import { ValidationException } from "../../core/exception";
import { LogsDto } from "../logs/logs.dto";
import { InsertLog } from "../logs/logs.service";

export const addNewProducts = async (req: Request, res: Response) => {
  const payload: NewProductsDto = req.body;
  const userId = payload.id ? payload.muid : payload.cuid;
  const newProductsRepository = appSource.getRepository(Newproducts);
  try {
    if (payload.id) {

      const updateError = updateNewProductsValidation.validate(payload);
      if (updateError.error) {
        throw new ValidationException(updateError.error.message);
      }

      const existingSettings = await newProductsRepository.findOneBy({ id: payload.id });
      if (!existingSettings) {
        throw new ValidationException("New Products settings not found");
      }

      const { id, ...updatePayload } = payload;
      await newProductsRepository.update({ id }, updatePayload);
      const logsPayload: LogsDto = {
        userId: userId,
        userName: '',
        statusCode: 200,
        message: `New products ${payload.products_Limit} updated by -`
      }
      await InsertLog(logsPayload);

      return res.status(200).send({
        message: "New Products settings updated successfully",
      });
    }

    // add new
    const validation = newProductsDtoValidation.validate(payload);
    if (validation.error) {
      throw new ValidationException(validation.error.message);
    }

    await newProductsRepository.save(payload);
    const logsPayload: LogsDto = {
      userId: userId,
      userName: '',
      statusCode: 200,
      message: `New product ${payload.products_Limit} added by -`
    }
    await InsertLog(logsPayload);

    return res.status(200).send({
      message: "New Products settings added successfully",
    });

  } catch (error) {
    const logsPayload: LogsDto = {
      userId: userId,
      userName: '',
      statusCode: 500,
      message: `Error while saving New Products ${payload.products_Limit} by -`
    }
    await InsertLog(logsPayload);
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error.message,
      });
    }
    return res.status(500).send({
      message: "Internal server error",
    });
  }
};

export const getNewProductsDetails = async (req: Request, res: Response) => {
  try {
    const Repository = appSource.getRepository(Newproducts);
    const newProductsList = await Repository.createQueryBuilder().getMany();

    res.status(200).send({
      Result: newProductsList,
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

export const getNewProductsToDisplay = async (req: Request, res: Response) => {
  try {
    const recentOffersRepository = appSource.getRepository(Newproducts);
    const details: NewProductsDto[] = await recentOffersRepository.query(
      `SELECT
  np.status AS newproduct_status,
  np.products_Limit,
  p.productid,
  p.product_name,
  p.discount,
  p.offer_price,
  p.stock,
  p.delivery_days,
  p.mrp,
  p.document,
  p.brandid,
  b.brandname, 
  p.categoryid,
  p.subcategoryid,
  p.delivery_amount,
  p.description,
  p.terms,
  p.warranty,
  b.brandimage,

  -- 🟢 First image and title
  (
    SELECT TOP 1 CAST(pn.image AS NVARCHAR(MAX))
    FROM [${process.env.DB_name}].[dbo].[product_nested] pn
    WHERE pn.productid = p.productid
    ORDER BY pn.id ASC
  ) AS image1,

  (
    SELECT TOP 1 CAST(pn.image_title AS NVARCHAR(MAX))
    FROM [${process.env.DB_name}].[dbo].[product_nested] pn
    WHERE pn.productid = p.productid
    ORDER BY pn.id ASC
  ) AS image1_title,

  -- 🟢 All images
  STUFF((
    SELECT ', ' + CAST(pn.image AS NVARCHAR(MAX))
    FROM [${process.env.DB_name}].[dbo].[product_nested] pn
    WHERE pn.productid = p.productid
    FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)')
  , 1, 2, '') AS images,

  -- 🟢 All image titles
  STUFF((
    SELECT ', ' + CAST(pn.image_title AS NVARCHAR(MAX))
    FROM [${process.env.DB_name}].[dbo].[product_nested] pn
    WHERE pn.productid = p.productid
    FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)')
  , 1, 2, '') AS image_titles,

  -- 🟢 variation_groups for current product
  STUFF((
    SELECT DISTINCT ', ' + v.variationGroup
    FROM [${process.env.DB_name}].[dbo].[variation] v
    WHERE v.productid = p.productid
    FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)')
  , 1, 2, '') AS variationGroup,

  -- ✅ variation_names: all variation names for those groups
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
    STUFF((
        SELECT DISTINCT ', ' + v2.productid
        FROM [${process.env.DB_name}].[dbo].[variation] v2
        WHERE v2.variationGroup IN (
            SELECT DISTINCT v1.variationGroup
            FROM [${process.env.DB_name}].[dbo].[variation] v1
            WHERE v1.productid = p.productid
        )
        FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)')
    , 1, 2, '') AS variationProductId

FROM [${process.env.DB_name}].[dbo].[newproducts] np

OUTER APPLY (
  SELECT TOP (np.products_Limit) *
  FROM [${process.env.DB_name}].[dbo].[products] p
  WHERE p.status = 1
  ORDER BY p.created_at DESC
) p

INNER JOIN [${process.env.DB_name}].[dbo].[brand_detail] b
  ON p.brandid = b.brandid;


`
    );
    res.status(200).send({ Result: details });
  } catch (error) {
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error?.message,
      });
    }
    res.status(500).send(error);
  }
};


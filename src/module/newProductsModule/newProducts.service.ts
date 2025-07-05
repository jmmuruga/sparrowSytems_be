import { appSource } from "../../core/db";
import { Request, Response } from "express";
import { NewProductsDto, newProductsDtoValidation, updateNewProductsValidation } from "./newProducts.dto";
import { Newproducts } from "./newProducts.model";
import { ValidationException } from "../../core/exception";

export const addNewProducts = async (req: Request, res: Response) => {
  const payload: NewProductsDto = req.body;
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

      return res.status(200).send({
        message: "New Products settings updated successfully",
      });
    }

    // add new
    const validation = newProductsDtoValidation.validate(payload);
    if (validation.error) {
      throw new ValidationException(validation.error.message);
    }

    await newProductsRepository.save(payload)

    return res.status(200).send({
      message: "New Products settings added successfully",
    });

  } catch (error) {
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
      `  SELECT
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

  -- Top 1 image and image title from product_nested
  pn.image AS top_image,
  pn.image_title AS top_image_title

FROM [SPARROW_SYSTEMS].[dbo].[newproducts] np

OUTER APPLY (
  SELECT TOP (np.products_Limit) *
  FROM [SPARROW_SYSTEMS].[dbo].[products] p
  WHERE p.status = 1
  ORDER BY p.created_at DESC
) p

--  INNER JOIN brand_detail to get brand name
INNER JOIN [SPARROW_SYSTEMS].[dbo].[brand_detail] b
  ON p.brandid = b.brandid

-- Nested OUTER APPLY to get top 1 image per product
OUTER APPLY (
  SELECT TOP 1 
    CAST(pn.image AS NVARCHAR(MAX)) AS image,
    CAST(pn.image_title AS NVARCHAR(MAX)) AS image_title
  FROM [SPARROW_SYSTEMS].[dbo].[product_nested] pn
  WHERE pn.productid = p.productid
  ORDER BY pn.id
) pn;

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

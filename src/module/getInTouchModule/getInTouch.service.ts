import { appSource } from "../../core/db";
import { Request, Response } from "express";
import { GetInTouchDto, getInTouchDtoValidation, updateGetInTouchValidation } from "./getInTouch.dto";
import { GetInTouch } from "./getInTouch.model";
import { ValidationException } from "../../core/exception";
import { LogsDto } from "../logs/logs.dto";
import { InsertLog } from "../logs/logs.service";

export const addGetInTouch = async (req: Request, res: Response) => {
  const payload: GetInTouchDto = req.body;
  const getInTouchRepository = appSource.getRepository(GetInTouch);
  const userId = payload.id ? payload.muid : payload.cuid;
  try {
    if (payload.id) {
      const updateError = updateGetInTouchValidation.validate(payload);
      if (updateError.error) {
        throw new ValidationException(updateError.error.message);
      }

      const existingSettings = await getInTouchRepository.findOneBy({ id: payload.id });
      if (!existingSettings) {
        throw new ValidationException("Button settings not found");
      }

      const { id, ...updatePayload } = payload;
      await getInTouchRepository.update({ id }, updatePayload);
      const logsPayload: LogsDto = {
        userId: userId,
        userName: '',
        statusCode: 200,
        message: `Get In Touch ${payload.button_name} updated by -`
      }
      await InsertLog(logsPayload);
      return res.status(200).send({
        message: "Button settings updated successfully",
      });
    }

    // add new
    const validation = getInTouchDtoValidation.validate(payload);
    if (validation.error) {
      throw new ValidationException(validation.error.message);
    }

    await getInTouchRepository.save(payload);
    const logsPayload: LogsDto = {
      userId: userId,
      userName: '',
      statusCode: 200,
      message: `Get In Touch ${payload.button_name} added by -`
    }
    await InsertLog(logsPayload);

    return res.status(200).send({
      message: "Button settings added successfully",
    });

  } catch (error) {
    const logsPayload: LogsDto = {
      userId: userId,
      userName: '',
      statusCode: 500,
      message: `Error while saving Get In Touch ${payload.button_name} by -`
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

// export const getButtonDetails = async (req: Request, res: Response) => {
//   try {
//     const Repository = appSource.getRepository(GetInTouch);
//     const newButtonList = await Repository.createQueryBuilder().getMany();

//     res.status(200).send({
//       Result: newButtonList,
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

export const getButtonDetails = async (req: Request, res: Response) => {
  try {
    const categoryRepository = appSource.getRepository(GetInTouch);
    const details: GetInTouchDto[] = await categoryRepository.query(
      ` 
SELECT TOP 1000 
    git.[id],
    git.[button_name],
    git.[productid],
    git.[created_at],
    git.[updated_at],
    git.[cuid],
    git.[muid],

    -- Product fields
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
    p.created_at AS product_created_at,
    p.updated_at AS product_updated_at,
    p.status,
    p.delivery_days,
    brand.brandname,
    p.document,

    -- First image
    (
        SELECT TOP 1 CAST(pn.image AS NVARCHAR(MAX))
        FROM ${process.env.DB_name}.[dbo].[product_nested] pn
        WHERE pn.productid = p.productid
        ORDER BY pn.id ASC
    ) AS image1,

    -- All images
    STUFF((
        SELECT ', ' + CAST(pn.image AS NVARCHAR(MAX))
        FROM ${process.env.DB_name}.[dbo].[product_nested] pn
        WHERE pn.productid = p.productid
        FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)')
    , 1, 2, '') AS images,

    -- All image titles
    STUFF((
        SELECT ', ' + CAST(pn.image_title AS NVARCHAR(MAX))
        FROM ${process.env.DB_name}.[dbo].[product_nested] pn
        WHERE pn.productid = p.productid
        FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)')
    , 1, 2, '') AS image_titles,

    -- variation_groups for this product
    STUFF((
        SELECT DISTINCT ', ' + v2.variationGroup
        FROM ${process.env.DB_name}.[dbo].[variation] v2
        WHERE v2.productid = p.productid
        FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)')
    , 1, 2, '') AS variationGroup,

    -- variation_names for all groups for this product
    STUFF((
        SELECT DISTINCT ', ' + v2.variationname
        FROM ${process.env.DB_name}.[dbo].[variation] v2
        WHERE v2.variationGroup IN (
            SELECT DISTINCT v1.variationGroup
            FROM ${process.env.DB_name}.[dbo].[variation] v1
            WHERE v1.productid = p.productid
        )
        FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)')
    , 1, 2, '') AS variation_names,

    -- variationProductId for all products in same groups
    STUFF((
        SELECT DISTINCT ', ' + CAST(v2.productid AS NVARCHAR(MAX))
        FROM ${process.env.DB_name}.[dbo].[variation] v2
        WHERE v2.variationGroup IN (
            SELECT DISTINCT v1.variationGroup
            FROM ${process.env.DB_name}.[dbo].[variation] v1
            WHERE v1.productid = p.productid
        )
        FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)')
    , 1, 2, '') AS variationProductId,

    brand.brandname 

FROM 
    ${process.env.DB_name}.[dbo].[get_in_touch] git
    LEFT JOIN ${process.env.DB_name}.[dbo].[products] p ON git.productid = p.productid
    LEFT JOIN ${process.env.DB_name}.[dbo].[brand_detail] brand ON p.brandid = brand.brandid
ORDER BY 
    git.created_at DESC;
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
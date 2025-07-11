import { appSource } from "../../core/db";
import { Request, Response } from "express";
import { RecentOffersDto, recentOffersDtoValidation, updateRecentOffersValidation } from "./recentOffers.dto";
import { RecentOffers } from "./recentOffers.model";
import { ValidationException } from "../../core/exception";
import { LogsDto } from "../logs/logs.dto";
import { InsertLog } from "../logs/logs.service";

export const addRecentOffersSettings = async (req: Request, res: Response) => {
  const payload: RecentOffersDto = req.body;
  const recentOffersRepository = appSource.getRepository(RecentOffers);
  const userId = payload.id ? payload.muid : payload.cuid;
  try {
    if (payload.id) {
      const updateError = updateRecentOffersValidation.validate(payload);
      if (updateError.error) {
        throw new ValidationException(updateError.error.message);
      }

      const existingSettings = await recentOffersRepository.findOneBy({ id: payload.id });
      if (!existingSettings) {
        throw new ValidationException("Recent Offers settings not found");
      }

      const { cuid, id, ...updatePayload } = payload;

      // const { id, ...updatePayload } = payload;
      await recentOffersRepository.update({ id }, updatePayload);
      const logsPayload: LogsDto = {
        userId: userId,
        userName: '',
        statusCode: 200,
        message: `Recent offers ${payload.products_Id} updated by -`
      }
      await InsertLog(logsPayload);
      return res.status(200).send({
        message: "Recent Offers settings updated successfully",
      });
    }

    // add new
    const validation = recentOffersDtoValidation.validate(payload);
    if (validation.error) {
      throw new ValidationException(validation.error.message);
    }

    await recentOffersRepository.save(payload);
    const logsPayload: LogsDto = {
      userId: userId,
      userName: '',
      statusCode: 200,
      message: `Recent offers ${payload.products_Id} added by -`
    }
    await InsertLog(logsPayload);

    return res.status(200).send({
      message: "Recent Offers settings added successfully",
    });

  } catch (error) {
    const logsPayload: LogsDto = {
      userId: userId,
      userName: '',
      statusCode: 500,
      message: `Error while saving recent Offers ${payload.products_Id} by -`
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

export const getRecentOffersDetails = async (req: Request, res: Response) => {
  try {
    const Repository = appSource.getRepository(RecentOffers);
    const recentOffersList = await Repository.createQueryBuilder().getMany();

    res.status(200).send({
      Result: recentOffersList,
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

export const getRecentOffersToDisplay = async (req: Request, res: Response) => {
  try {
    const recentOffersRepository = appSource.getRepository(RecentOffers);
    const details: RecentOffersDto[] = await recentOffersRepository.query(
      `SELECT
    ro.id,
    ro.status AS offer_status,
    ro.products_Id,
    s.value AS product_id,
    p.productid,
    p.product_name,
    p.stock,
    p.brandid,
    b.brandname,
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

    -- 🟢 All images and titles
    STUFF((
        SELECT ', ' + CAST(pn.image AS NVARCHAR(MAX))
        FROM [${process.env.DB_name}].[dbo].[product_nested] pn
        WHERE pn.productid = p.productid
        FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)')
    , 1, 2, '') AS images,

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

    -- ✅ variation_grouped_all: all variation names for those groups (no group name)
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

FROM
    [${process.env.DB_name}].[dbo].[recent_offers] ro
CROSS APPLY (
    SELECT LTRIM(RTRIM(m.n.value('.', 'VARCHAR(100)'))) AS value
    FROM (
        SELECT CAST('<XMLRoot><RowData>' +
                     REPLACE(ro.products_Id, ',', '</RowData><RowData>') +
                     '</RowData></XMLRoot>' AS XML) AS x
    ) AS t
    CROSS APPLY x.nodes('/XMLRoot/RowData') m(n)
) s
INNER JOIN [${process.env.DB_name}].[dbo].[products] p
    ON CAST(s.value AS INT) = p.productid
INNER JOIN [${process.env.DB_name}].[dbo].[brand_detail] b
    ON p.brandid = b.brandid
WHERE
    p.status = 1; `
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
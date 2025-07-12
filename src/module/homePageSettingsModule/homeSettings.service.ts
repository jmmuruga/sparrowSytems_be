import { appSource } from "../../core/db";
import { ValidationException } from "../../core/exception";
import { LogsDto } from "../logs/logs.dto";
import { InsertLog } from "../logs/logs.service";
import { homeSettingsDto, homeSettingsDtoValidation, updateHomeSettingsValidation } from "./homeSettings.dto";
import { homeSettings } from "./homeSettings.model";
import { Request, Response } from "express";

export const addHomesettings = async (req: Request, res: Response) => {
  const payload: homeSettingsDto = req.body;
  const homeRepository = appSource.getRepository(homeSettings);
  const userId = payload.id ? payload.muid : payload.cuid;

  try {

    if (!payload.categoryid && !payload.subcategoryid) {
      throw new ValidationException('please select category');
    }
    if (payload.id) {
      const { error: updateError } = updateHomeSettingsValidation.validate(payload);
      if (updateError) {
        throw new ValidationException(updateError.message);
      }

      const existingSettings = await homeRepository.findOneBy({ id: payload.id });
      if (!existingSettings) {
        throw new ValidationException("Home settings not found");
      }

      const { id, ...updatePayload } = payload;
      await homeRepository.update({ id }, updatePayload);

      const logsPayload: LogsDto = {
        userId: userId,
        userName: '',
        statusCode: 200,
        message: `Home Settings ${payload.categoryid} updated by -`
      }
      await InsertLog(logsPayload);

      return res.status(200).send({
        message: "Home settings updated successfully",
      });
    }

    // add new
    const { error } = homeSettingsDtoValidation.validate(payload);
    if (error) {
      throw new ValidationException(error.message);
    }

    const homeSettingsRepository = appSource.getRepository(homeSettings);

    const newSettings = homeSettingsRepository.create(payload);
    const savedSettings = await homeSettingsRepository.save(newSettings);
    const logsPayload: LogsDto = {
      userId: userId,
      userName: '',
      statusCode: 200,
      message: `Home Settings ${payload.categoryid} added by -`
    }
    await InsertLog(logsPayload);
    return res.status(201).send({
      message: "Home settings added successfully",
      data: savedSettings,
    });

  } catch (error) {
    const logsPayload: LogsDto = {
      userId: userId,
      userName: '',
      statusCode: 500,
      message: `Error while saving Home Settings ${payload.categoryid} by -`
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

export const getHomeSettingsDetails = async (req: Request, res: Response) => {
  try {
    const Repository = appSource.getRepository(homeSettings);
    const homeSettingList = await Repository.createQueryBuilder().getMany();

    res.status(200).send({
      Result: homeSettingList,
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

export const getHomePageCategoryToDisplay = async (req: Request, res: Response) => {
  try {
    const homeRepository = appSource.getRepository(homeSettings);
    const details: homeSettingsDto[] = await homeRepository.query(
      `SELECT 
  hs.id,
  hs.visible,
  hs.categoryid,
  hs.subcategoryid,
  hs.column_count,
  hs.row_count,
  c.categoryname AS category_name,
  cn.categoryname AS subcategory_name, 
  p.productid,
  p.product_name,
  p.mrp,
  p.discount,
  p.offer_price,
  p.created_at,
  p.status,
  p.delivery_charges, 
  p.delivery_days,    
  p.warranty,         
  p.stock,            
  p.description,      
  p.terms,            
  p.image,
  p.image_title,
  p.image1,
  p.image1_title,
  p.images,
  p.image_titles,
  p.variationGroup,
  p.variation_names,
  p.variationProductId

FROM [${process.env.DB_name}].[dbo].[home_settings] hs
LEFT JOIN [${process.env.DB_name}].[dbo].[category] c
  ON hs.categoryid = c.categoryid
LEFT JOIN [${process.env.DB_name}].[dbo].[category_nested] cn
  ON hs.subcategoryid = cn.subcategoryid

OUTER APPLY (
  SELECT TOP (hs.column_count * hs.row_count)
    pr.productid,
    pr.product_name,
    pr.mrp,
    pr.discount,
    pr.offer_price,
    pr.created_at,
    pr.status,
    pr.delivery_charges,   
    pr.delivery_days,      
    pr.warranty,           
    pr.stock,              
    pr.description,        
    pr.terms,              
    ISNULL(img.image, '') AS image,
    ISNULL(img.image_title, '') AS image_title,

    -- Images & variations
    (
        SELECT TOP 1 CAST(pn.image AS NVARCHAR(MAX))
        FROM [${process.env.DB_name}].[dbo].[product_nested] pn
        WHERE pn.productid = pr.productid
        ORDER BY pn.id ASC
    ) AS image1,

    (
        SELECT TOP 1 CAST(pn.image_title AS NVARCHAR(MAX))
        FROM [${process.env.DB_name}].[dbo].[product_nested] pn
        WHERE pn.productid = pr.productid
        ORDER BY pn.id ASC
    ) AS image1_title,

    STUFF((
        SELECT ', ' + CAST(pn.image AS NVARCHAR(MAX))
        FROM [${process.env.DB_name}].[dbo].[product_nested] pn
        WHERE pn.productid = pr.productid
        FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)')
    , 1, 2, '') AS images,

    STUFF((
        SELECT ', ' + CAST(pn.image_title AS NVARCHAR(MAX))
        FROM [${process.env.DB_name}].[dbo].[product_nested] pn
        WHERE pn.productid = pr.productid
        FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)')
    , 1, 2, '') AS image_titles,

    STUFF((
        SELECT DISTINCT ', ' + v.variationGroup
        FROM [${process.env.DB_name}].[dbo].[variation] v
        WHERE v.productid = pr.productid
        FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)')
    , 1, 2, '') AS variationGroup,

    STUFF((
        SELECT DISTINCT ', ' + v2.variationname
        FROM [${process.env.DB_name}].[dbo].[variation] v2
        WHERE v2.variationGroup IN (
            SELECT DISTINCT v1.variationGroup
            FROM [${process.env.DB_name}].[dbo].[variation] v1
            WHERE v1.productid = pr.productid
        )
        FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)')
    , 1, 2, '') AS variation_names,

    STUFF((
        SELECT DISTINCT ', ' + CAST(v2.productid AS NVARCHAR(MAX))
        FROM [${process.env.DB_name}].[dbo].[variation] v2
        WHERE v2.variationGroup IN (
            SELECT DISTINCT v1.variationGroup
            FROM [${process.env.DB_name}].[dbo].[variation] v1
            WHERE v1.productid = pr.productid
        )
        FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)')
    , 1, 2, '') AS variationProductId

  FROM [${process.env.DB_name}].[dbo].[products] pr

  OUTER APPLY (
    SELECT TOP 1 
           pn.image,
           pn.image_title
    FROM [${process.env.DB_name}].[dbo].[product_nested] pn
    WHERE pn.productid = pr.productid
    ORDER BY pn.id DESC
  ) img

  WHERE 
    (
      (hs.categoryid IS NOT NULL AND hs.subcategoryid IS NULL AND
        ',' + pr.categoryid + ',' LIKE '%,' + CAST(hs.categoryid AS NVARCHAR(10)) + ',%')

      OR

      (hs.subcategoryid IS NOT NULL AND hs.categoryid IS NULL AND
        ',' + pr.subcategoryid + ',' LIKE '%,' + CAST(hs.subcategoryid AS NVARCHAR(10)) + ',%')

      OR

      (hs.categoryid IS NOT NULL AND hs.subcategoryid IS NOT NULL AND
        ',' + pr.categoryid + ',' LIKE '%,' + CAST(hs.categoryid AS NVARCHAR(10)) + ',%'
        AND ',' + pr.subcategoryid + ',' LIKE '%,' + CAST(hs.subcategoryid AS NVARCHAR(10)) + ',%')
    )
    AND pr.status = 1
  ORDER BY pr.productid DESC
) p; `
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
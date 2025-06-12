import { appSource } from "../../core/db";
import { ValidationException } from "../../core/exception";
import { homeSettingsDto, homeSettingsDtoValidation, updateHomeSettingsValidation } from "./homeSettings.dto";
import { homeSettings } from "./homeSettings.model";
import { Request, Response } from "express";

export const addHomesettings = async (req: Request, res: Response) => {
  const payload: homeSettingsDto = req.body;
  const homeRepository = appSource.getRepository(homeSettings);
  try {
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

    return res.status(201).send({
      message: "Home settings added successfully",
      data: savedSettings,
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

// export const getHomePageCategoryToDisplay = async (req: Request, res: Response) => {
//   try {
//     const homeRepository = appSource.getRepository(homeSettings);
//     const details: homeSettingsDto[] = await homeRepository.query(
//       `  SELECT 
//     hs.[id],
//     hs.[visible],
//     hs.[category_Id],
//     c.[categoryname] AS category_name,
//     hs.[column_count],
//     hs.[list_count],
//     p.[productid],
//     p.[product_name],
// 	p.[mrp],
//     p.[discount],
//     p.[offer_price],
//     p.[image1],
//     p.[created_at],
//     p.[status]
// FROM [${process.env.DB_name}].[dbo].[home_settings] hs
// INNER JOIN [${process.env.DB_name}].[dbo].[category] c
//     ON hs.[category_Id] = c.[categoryid]
// OUTER APPLY (
//     SELECT TOP (hs.[list_count])
//            pr.[productid],
//            pr.[product_name],
// 		   pr.[mrp],
// 		   pr.[discount],
//            pr.[offer_price],
//            pr.[image1],
//            pr.[created_at],
//            pr.[status]
//     FROM [${process.env.DB_name}].[dbo].[products] pr
    
//     ORDER BY pr.[productid] DESC
// ) p; `
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

export const getHomePageCategoryToDisplay = async (req: Request, res: Response) => {
  try {
    const homeRepository = appSource.getRepository(homeSettings);
    const details: homeSettingsDto[] = await homeRepository.query(
      `  SELECT 
    hs.[id],
    hs.[visible],
    hs.[category_Id],
    c.[categoryname] AS category_name,
    hs.[column_count],
    hs.[list_count],
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
              FROM [SPARROW_SYSTEMS].[dbo].[variation] v2
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
FROM [SPARROW_SYSTEMS].[dbo].[home_settings] hs
INNER JOIN [SPARROW_SYSTEMS].[dbo].[category] c
    ON hs.[category_Id] = c.[categoryid]
OUTER APPLY (
    SELECT TOP (hs.[list_count])
           pr.[productid],
           pr.[product_name],
           pr.[mrp],
           pr.[discount],
           pr.[offer_price],
           pr.[image1],
           pr.[created_at],
           pr.[status],
           pr.stock,
           pr.brand_name,
           pr.category_name,
           pr.min_qty,
           pr.max_qty,
           pr.delivery_charges,
           pr.delivery_amount,
           pr.variation_group,
           STUFF((
               SELECT ', ' + v2.name
               FROM [SPARROW_SYSTEMS].[dbo].[variation] v2
               WHERE v2.variationGroup = pr.variation_group
               FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), 1, 2, '') AS variation_names,
           pr.description,
           pr.terms,
           pr.warranty,
           pr.image2,
           pr.image3,
           pr.image4,
           pr.image5,
           pr.image6,
           pr.image7,
           pr.cuid,
           pr.muid,
           pr.updated_at,
           pr.delivery_days,
           pr.document
    FROM [SPARROW_SYSTEMS].[dbo].[products] pr
    ORDER BY pr.[productid] DESC
) p`
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
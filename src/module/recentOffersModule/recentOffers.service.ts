import { appSource } from "../../core/db";
import { Request, Response } from "express";
import { RecentOffersDto, recentOffersDtoValidation, updateRecentOffersValidation } from "./recentOffers.dto";
import { RecentOffers } from "./recentOffers.model";
import { ValidationException } from "../../core/exception";


export const addRecentOffersSettings = async (req: Request, res: Response) => {
  const payload: RecentOffersDto = req.body;
  const recentOffersRepository = appSource.getRepository(RecentOffers);
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

      const { id, ...updatePayload } = payload;
      await recentOffersRepository.update({ id }, updatePayload);

      return res.status(200).send({
        message: "Recent Offers settings updated successfully",
      });
    }

    // add new
    const validation = recentOffersDtoValidation.validate(payload);
    if (validation.error) {
      throw new ValidationException(validation.error.message);
    }

    await recentOffersRepository.save(payload)

    return res.status(200).send({
      message: "Recent Offers settings added successfully",
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
      `  SELECT ro.id,
       ro.status,
       ro.products_Id,
       s.value AS product_id,
       p.product_name,
       p.image1,
	   p.discount,
     p.productid,
	   p.offer_price,
	   p.mrp
FROM [${process.env.DB_name}].[dbo].[recent_offers] ro
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
    WHERE p.status = 1 ;`
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


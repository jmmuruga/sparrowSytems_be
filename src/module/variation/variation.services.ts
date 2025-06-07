import { appSource } from "../../core/db";
import { HttpException, ValidationException } from "../../core/exception";
import { Request, Response } from "express";
import { variation } from "./variation.model";
import { variationDto, variationUpdateValidate, variationValidate } from "./variation.dto";


export const addVariation = async (req: Request, res: Response) => {
  const payload: variation = req.body;
  try {
    const Repository = appSource.getRepository(variation);

    if (payload.id) {
      const validation = variationUpdateValidate.validate(payload);
      if (validation?.error) {
        throw new ValidationException(validation.error.message);
      }
      const variation = await Repository.findOneBy({
        id: payload.id,
      });
      if (!variation?.id) {
        throw new ValidationException("id not found");
      }
      const { cuid, id, ...updatePayload } = payload;
      await Repository.update({ id: payload.id }, updatePayload);
      res.status(200).send({
        IsSuccess: " variation updated SuccessFully",
      });
      return;
    }
    const validation = variationValidate.validate(payload);
    if (validation?.error) {
      throw new ValidationException(validation.error.message);
    }

    const { id, ...updatePayload } = payload;
    await Repository.save(updatePayload);
    res.status(200).send({
      IsSuccess: " variation added SuccessFully",
    });
  } catch (error) {
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error.message,
      });
    }
    res.status(500).send({ message: "Internal server error" });
  }
};

export const generateVariationId = async (req: Request, res: Response) => {
  try {
    const variationRepoistry = appSource.getRepository(variation);
    const variationList = await variationRepoistry
      .query(
        `SELECT variationid
            FROM [SPARROW_SYSTEMS].[dbo].[variation]
            Group by variationid
            ORDER BY CAST(variationid AS INT) DESC;`
      )
    let id = '0'
    if (variationList?.length > 0) {
      id = variationList[0].variationid;
    }
    res.status(200).send({
      Result: +id + +1,
    });

  }
  catch (error) {
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error.message,
      });
    }
    res.status(500).send({ message: "Internal server error" });
  }
}


export const getvariation = async (req: Request, res: Response) => {
  try {
    const Repository = appSource.getRepository(variation);

    const Data = await Repository.createQueryBuilder().getMany();
    res.status(200).send({
      Result: Data,
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









































































export const getVariationGroup = async (req: Request, res: Response) => {
  try {
    const orderRepository = appSource.getRepository(variation);
    const details: variationDto[] = await orderRepository.query(
      `SELECT 
    variationid,
    MAX(id) AS id,
    MAX(variationGroup) AS variationGroup,
    MAX(name) AS name,
    MAX(itemId) AS itemId,
    MAX(CAST(status AS INT)) AS status,
    MAX(cuid) AS cuid,
    MAX(muid) AS muid,
    MAX(created_at) AS created_at,
    MAX(updated_at) AS updated_at
FROM [${process.env.DB_name}].[dbo].[variation]
GROUP BY variationid`
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

export const getVariationName = async (req: Request, res: Response) => {
  try {
    const orderRepository = appSource.getRepository(variation);
    const details: variationDto[] = await orderRepository.query(
      `SELECT TOP 1000 
    p.productid,
    p.variation_group,
    v.id AS variation_id,
    v.name AS variation_name
FROM [${process.env.DB_name}].[dbo].[products] p
INNER JOIN [${process.env.DB_name}].[dbo].[variation] v
    ON p.variation_group = v.variationGroup`
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
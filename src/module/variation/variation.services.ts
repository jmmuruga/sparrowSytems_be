import { appSource } from "../../core/db";
import { HttpException, ValidationException } from "../../core/exception";
import { Request, Response } from "express";
import { variation } from "./variation.model";
import { variationUpdateValidate, variationValidate } from "./variation.dto";


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
      await Repository.update({  id: payload.id }, updatePayload);
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

export const generateVariationId = async(req : Request  , res : Response) =>{
    try{
        const variationRepoistry = appSource.getRepository(variation);
        const variationList = await variationRepoistry
            .query(
                `SELECT variationid
            FROM [SPARROW_SYSTEMS].[dbo].[variation]
            Group by variationid
            ORDER BY CAST(variationid AS INT) DESC;`
            )
        let id = '0'
        if(variationList?.length > 0){
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

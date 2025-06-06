import { appSource } from "../../core/db";
import { HttpException, ValidationException } from "../../core/exception";
import { Request, Response } from "express";
import { variation } from "./variation.model";
import { variationUpdateValidate, variationValidate } from "./variation.dto";

export const addVariation = async (req: Request, res: Response) => {
  const payload: variation = req.body;

  try {
    const Repository = appSource.getRepository(variation);

    const checkWhetherExist = await Repository.findOneBy({
      variationid: payload.variationid,
    });

    if (checkWhetherExist) {
      const validation = variationUpdateValidate.validate(payload);
      if (validation?.error) {
        throw new ValidationException(validation.error.message);
      }
      const { id,cuid, ...updatePayload } = payload;
      await Repository.update(
        { variationid: payload.variationid },
        updatePayload
      );
      res.status(200).send({
        IsSuccess: " variation updated SuccessFully",
      });
      return;
    } else {
      const validation = variationValidate.validate(payload);
      if (validation?.error) {
        throw new ValidationException(validation.error.message);
      }

      const { id, ...updatePayload } = payload;
      await Repository.save(updatePayload);
      res.status(200).send({
        IsSuccess: " variation added SuccessFully",
      });
    }
  } catch (error) {
    console.log(error , 'error')
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
    const variationList = await variationRepoistry.query(
      `SELECT variationid
            FROM [SPARROW_SYSTEMS].[dbo].[variation]
            Group by variationid
            ORDER BY CAST(variationid AS INT) DESC;`
    );
    let id = "0";
    if (variationList?.length > 0) {
      id = variationList[0].variationid;
    }
    res.status(200).send({
      Result: +id + +1,
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

export const deleteVariationid = async (req: Request, res: Response) => {
  const id = req.params.id;
  const Repo = appSource.getRepository(variation);

  try {
    const deleteVariation = await Repo.createQueryBuilder("variation")
      .where("variation.variationid = :id", {
        id: id,
      })
      .getOne();
    if (!deleteVariation) {
      throw new HttpException("id not Found", 400);
    }
    await Repo.createQueryBuilder("variation")
      .delete()
      .from(variation)
      .where("variationid = :id", { id: id })
      .execute();
    res.status(200).send({
      IsSuccess: `id  deleted successfully!`,
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

export const variationStatus = async (req: Request, res: Response) => {
  const id = req.params.id;
  const statusVal: boolean = req.params.status === "true";
  const repo = appSource.getRepository(variation);

  try {
    const typeNameFromDb = await repo
      .createQueryBuilder("variation")
      .where("variation.variationid = :id", {
        id: id,
      })
      .getOne();
    if (!typeNameFromDb?.variationid) {
      throw new HttpException("Data not Found", 400);
    }
    await repo
      .createQueryBuilder()
      .update(variation)
      .set({ status: statusVal })
      .where({ variationid: id })
      .execute();

    res.status(200).send({
      IsSuccess: `Status Updated successfully!`,
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

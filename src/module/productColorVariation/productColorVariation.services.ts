import { appSource } from "../../core/db";
import { HttpException, ValidationException } from "../../core/exception";
import { Request, Response } from "express";
import { productColorVariation } from "./productColorVariation.model";
import {
  productColorUpadteVariationValidate,
  productColorVariationDto,
  productColorVariationValidate,
} from "./productColorVariation.dto";
import { report } from "node:process";

export const addImageColour = async (req: Request, res: Response) => {
  const payload: productColorVariationDto = req.body;
  try {
    const Repository = appSource.getRepository(productColorVariation);
    if (payload.id) {
      const validation = productColorUpadteVariationValidate.validate(payload);
      if (validation?.error) {
        throw new ValidationException(validation.error.message);
      }
      const colourVariation = await Repository.findOneBy({ id: payload.id });
      if (!colourVariation?.id) {
        throw new ValidationException("id  not found");
      }

      const { cuid, id, ...updatePayload } = payload;
      await Repository.update({ id: payload.id }, updatePayload);
      res.status(200).send({
        IsSuccess: "product colour  updated SuccessFully",
      });
      return;
    }

    const validation = productColorVariationValidate.validate(payload);
    if (validation?.error) {
      throw new ValidationException(validation.error.message);
    }

    const { id, cuid, ...insertdata } = payload;
    await Repository.save(insertdata);
    res.status(200).send({
      IsSuccess: "product colour added SuccessFully",
    });
    return;
  } catch (error) {
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error.message,
      });
    }
    res.status(500).send({ message: "Internal server error" });
  }
};

export const getcolourVariationData = async (req: Request, res: Response) => {
  try {
    const Repository = appSource.getRepository(productColorVariation);
    const getcolour = await Repository.createQueryBuilder().getMany();
    res.status(200).send({
      Result: getcolour,
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

export const deleteColour = async (req: Request, res: Response) => {
  const id = req.params.id;
  const colourVariationRepo = appSource.getRepository(productColorVariation);
  try {
    const deleteData = await colourVariationRepo
      .createQueryBuilder("productColorVariation")
      .where("productColorVariation.id =:id", {
        id: id,
      })
      .getOne();
    if (!deleteData?.id) {
      throw new HttpException("id not found", 404);
    }

    await colourVariationRepo
      .createQueryBuilder("productColorVariation")
      .delete()
      .from(productColorVariation)
      .where("id=:id", { id: id })
      .execute();
    res.status(200).send({
      IsSuccess: `id ${id} deleted successfully!`,
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

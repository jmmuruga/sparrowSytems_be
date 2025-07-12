import { appSource } from "../../core/db";
import { HttpException, ValidationException } from "../../core/exception";
import {
  brandDto,
  brandValidation,
  changebrandStatusDto,
  updateBrandValidation,
} from "./brand.dto";
import { Request, Response } from "express";
import { BrandDetail } from "./brand.model";
import { products } from "../productModule/product.model";
import { Not } from "typeorm";
import { LogsDto } from "../logs/logs.dto";
import { InsertLog } from "../logs/logs.service";

export const addBrand = async (req: Request, res: Response) => {
  const payload: brandDto = req.body;
  const userId = payload.brandid ? payload.muid : payload.cuid;
  try {
    const BrandRepository = appSource.getRepository(BrandDetail);

    if (payload.brandid) {
      const validation = updateBrandValidation.validate(payload);
      if (validation?.error) {
        throw new ValidationException(validation.error.message);
      }

      const brandDetails = await BrandRepository.findOneBy({
        brandid: payload.brandid,
      });
      if (!brandDetails?.brandid) {
        throw new ValidationException("Brand not found");
      }
      const brandNameValiadtion = await BrandRepository.findBy({
        brandname: payload.brandname,
        brandid: Not(payload.brandid),
      });
      if (brandNameValiadtion?.length) {
        throw new ValidationException("Brand name already  exists");
      }

      const { cuid, brandid, ...updatePayload } = payload;
      await BrandRepository.update({ brandid: payload.brandid }, updatePayload);
      const logsPayload: LogsDto = {
        userId: userId,
        userName: '',
        statusCode: 200,
        message: `Brand ${payload.brandname} updated by -`
      }
      await InsertLog(logsPayload);
      res.status(200).send({
        IsSuccess: "Brand Details updated SuccessFully",
      });
      return;
    }
    const validation = brandValidation.validate(payload);
    if (validation?.error) {
      throw new ValidationException(validation.error.message);
    }
    const validateTypeName = await BrandRepository.findBy({
      email: payload.email,
    });
    if (validateTypeName?.length) {
      throw new ValidationException("Email already exist");
    }
    const brandNameValiadtion = await BrandRepository.findBy({
      brandname: payload.brandname,
    });
    if (brandNameValiadtion?.length) {
      throw new ValidationException("brandname already exists");
    }

    const { brandid, ...updatePayload } = payload;
    await BrandRepository.save(updatePayload);
    const logsPayload: LogsDto = {
      userId: userId,
      userName: '',
      statusCode: 200,
      message: `Brand ${payload.brandname} added by -`
    }
    await InsertLog(logsPayload);
    res.status(200).send({
      IsSuccess: "Brand Details added SuccessFully",
    });
  } catch (error) {
    const logsPayload: LogsDto = {
      userId: userId,
      userName: '',
      statusCode: 500,
      message: `Error while saving Brand ${payload.brandname} by -`
    }
    await InsertLog(logsPayload);
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error.message,
      });
    }
    res.status(500).send({ message: "Internal server error" });
  }
};

export const deleteBrand = async (req: Request, res: Response) => {
  const brandid = Number(req.params.brandid);
  const userId = Number(req.params.userId);
  if (brandid < 0 || !brandid) {
    return res.status(400).send({ message: "Invalid brand ID" });
  }

  const brandRepo = appSource.getRepository(BrandDetail);
  const productRepo = appSource.getRepository(products);
  const brand = await brandRepo.findOneBy({ brandid: brandid });

  if (!brand) {
    throw new HttpException("Brand not found", 404);
  }
  try {
    const usedInProducts = await productRepo
      .createQueryBuilder()
      .where({
        brandid: brandid,
      })
      .getMany();

    if (usedInProducts.length > 0) {
      throw new ValidationException(
        "Unable to delete brand. It is currently used by products."
      );
    }

    await brandRepo
      .createQueryBuilder()
      .delete()
      .from(BrandDetail)
      .where({ brandid: brandid })
      .execute();
    const logsPayload: LogsDto = {
      userId: userId,
      userName: '',
      statusCode: 200,
      message: `Brand ${brand.brandname} deleted by -`
    }
    await InsertLog(logsPayload);

    res.status(200).send({
      IsSuccess: "Brand deleted successfully!",
    });
  } catch (error) {
    const logsPayload: LogsDto = {
      userId: userId,
      userName: '',
      statusCode: 500,
      message: `Error while deleting Brand ${brand.brandname}  by -`
    }
    await InsertLog(logsPayload);
    if (error instanceof ValidationException) {
      return res.status(400).send({ message: error.message });
    }
    res.status(500).send(error);
  }
};

export const changeStatusBrand = async (req: Request, res: Response) => {
  const brandStatus: changebrandStatusDto = req.body;
  const brandRepository = appSource.getRepository(BrandDetail);
  const categoryFromDB = await brandRepository.findBy({
    brandid: brandStatus.brandid,
  });
  if (categoryFromDB.length == 0) {
    throw new HttpException("Data not Found", 400);
  }
  try {

    await brandRepository
      .createQueryBuilder()
      .update(BrandDetail)
      .set({ status: brandStatus.status })
      .where("brandid = :brandid", { brandid: brandStatus.brandid })
      .execute();

    const logsPayload: LogsDto = {
      userId: Number(brandStatus.userId),
      userName: '',
      statusCode: 200,
      message: `Brand ${categoryFromDB[0].brandname} status changed to ${brandStatus.status} by -`
    }
    await InsertLog(logsPayload);

    res.status(200).send({
      IsSuccess: `Status Updated successfully!`,
    });
  } catch (error) {
    const logsPayload: LogsDto = {
      userId: Number(brandStatus.userId),
      userName: '',
      statusCode: 500,
      message: `Error while changing status for Brand ${categoryFromDB[0].brandname}  to ${brandStatus.status} by -`
    }
    await InsertLog(logsPayload);
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error?.message,
      });
    }
    res.status(500).send(error);
  }
};

export const getBrandDetail = async (req: Request, res: Response) => {
  try {
    const Repository = appSource.getRepository(BrandDetail);

    const brandList = await Repository.createQueryBuilder("brand")
      .orderBy("brand.brandname", "ASC")
      .getMany();
    res.status(200).send({
      Result: brandList,
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

export const getTopBrandDetail = async (req: Request, res: Response) => {
  try {
    const Repository = appSource.getRepository(BrandDetail);

    const brandList = await Repository.createQueryBuilder("brand")
      .orderBy("brand.brandname", "ASC")
      .limit(18)
      .getMany();
    res.status(200).send({
      Result: brandList,
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

export const getBrandCount = async (req: Request, res: Response) => {
  try {
    const brandid = req.params.brandid;
    const brandRepository = appSource.getRepository(BrandDetail);
    const details: brandDto[] = await brandRepository.query(
      `
     select brand_detail.brandid from [${process.env.DB_name}].[dbo].[brand_detail] 
     inner join [${process.env.DB_name}].[dbo].[products]
     on brand_detail.brandid = products.brandid 
     where brand_detail.brandid = ${brandid};
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

export const getActiveBrandCount = async (req: Request, res: Response) => {
  try {
    const brandname = req.params.brandid;
    const brandRepository = appSource.getRepository(BrandDetail);
    const details: brandDto[] = await brandRepository.query(
      `
     select products.brandid from [${process.env.DB_name}].[dbo].[brand_detail] 
     inner join [${process.env.DB_name}].[dbo].[products]
     on brand_detail.brandid = products.brandid 
     where products.status = 1 and products.brandid = '${brandname}';
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

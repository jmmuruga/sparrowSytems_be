import { appSource } from "../../core/db";
import { HttpException, ValidationException } from "../../core/exception";
import { brandDto, brandValidation, updateBrandValidation } from "./brand.dto";
import { Request, Response } from "express";
import { BrandDetail } from "./brand.model";
import { products } from "../productModule/product.model";

export const addBrand = async (req: Request, res: Response) => {
  const payload: brandDto = req.body;
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
      const { cuid, brandid, ...updatePayload } = payload;
      await BrandRepository.update({ brandid: payload.brandid }, updatePayload);
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
    const { brandid, ...updatePayload } = payload;
    await BrandRepository.save(updatePayload);
    res.status(200).send({
      IsSuccess: "Brand Details added SuccessFully",
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

export const deleteBrand = async (req: Request, res: Response) => {
  const brandid = Number(req.params.brandid);

  if (isNaN(brandid)) {
    return res.status(400).send({ message: "Invalid brand ID" });
  }

  const brandRepo = appSource.getRepository(BrandDetail);
  const productRepo = appSource.getRepository(products);

  try {
    const brand = await brandRepo.findOneBy({ brandid });

    if (!brand) {
      throw new HttpException("Brand not found", 400);
    }

    const usedInProducts = await productRepo
      .createQueryBuilder("product")
      .where("LOWER(product.brand_name) = LOWER(:brandName)", {
        brandName: brand.brandname.trim(),
      })
      .getMany();

    if (usedInProducts.length > 0) {
      throw new ValidationException("Unable to delete brand. It is currently used by products.");
    }

    // Step 3: Delete the brand
    await brandRepo.delete({ brandid });

    res.status(200).send({
      IsSuccess: "Brand deleted successfully!",
    });
  } catch (error) {
    if (error instanceof ValidationException) {
      return res.status(400).send({ message: error.message });
    }
    res.status(500).send(error);
  }
};

export const changeStatusBrand = async (req: Request, res: Response) => {
  const id = req.params.albumid;

  const statusVal: boolean = req.params.status === "true";
  const repo = appSource.getRepository(BrandDetail);

  try {
    const typeNameFromDb = await repo
      .createQueryBuilder("BrandDetail")
      .where("BrandDetail.brandid = :brandid", {
        albumid: id,
      })
      .getOne();
    if (!typeNameFromDb?.brandid) {
      throw new HttpException("Data not Found", 400);
    }
    await repo
      .createQueryBuilder()
      .update(BrandDetail)
      .set({ status: statusVal })
      .where({ brandid: id })
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

export const updateBrand = async (req: Request, res: Response) => {
  const payload: brandDto = req.body;

  try {
    // Validate request data
    const validation = brandValidation.validate(payload);
    if (validation?.error) {
      throw new ValidationException(validation.error.message);
    }

    const BrandRepository = appSource.getRepository(BrandDetail);

    // Find the existing brand by ID
    const existingBrand = await BrandRepository.findOneBy({
      brandid: payload.brandid,
    });

    if (!existingBrand) {
      return res.status(404).send({ message: "Brand not found" });
    }

    // Check if the email is being changed and already exists
    if (existingBrand.email !== payload.email) {
      const emailExists = await BrandRepository.findBy({
        email: payload.email,
      });

      if (emailExists.length) {
        throw new ValidationException("Email already exists");
      }
    }

    // Remove non-updatable fields
    const { brandid, ...updatePayload } = payload;

    // Update the brand details
    await BrandRepository.update({ brandid }, updatePayload);

    res.status(200).send({
      IsSuccess: "Brand details updated successfully",
    });
  } catch (error) {
    if (error instanceof ValidationException) {
      return res.status(400).send({ message: error.message });
    }

    res.status(500).send({ message: "Internal server error" });
  }
};

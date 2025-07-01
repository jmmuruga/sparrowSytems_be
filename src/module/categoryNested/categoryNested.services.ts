import { appSource } from "../../core/db";
import { HttpException, ValidationException } from "../../core/exception";
import { Request, Response } from "express";
import {
  CategoryNestedDto,
  categorynestedUpdateValidation,
  categorynestedValidation,
  changenestedCategroyStatusDto,
} from "./categoryNested.dto";
import { CategoryNested } from "./categoryNested.model";
import { Not } from "typeorm";

export const addsubCategory = async (req: Request, res: Response) => {
  const payload: CategoryNestedDto = req.body;

  try {
    const categoryRepository = appSource.getRepository(CategoryNested);

    if (payload.subcategoryid) {
      const validation = categorynestedUpdateValidation.validate(payload);
      if (validation?.error) {
        throw new ValidationException(validation.error.message);
      }
      const category = await categoryRepository.findOneBy({
        subcategoryid: payload.subcategoryid,
      });
      if (!category?.subcategoryid) {
        throw new ValidationException("sub category   not found");
      }
      const subcategoryNameValiadtion = await categoryRepository.findBy({
        categoryname: payload.categoryname,
        subcategoryid: Not(payload.subcategoryid),
      });
      if (subcategoryNameValiadtion?.length) {
        throw new ValidationException("category name already  exists");
      }

      const { cuid, subcategoryid, ...updatePayload } = payload;
      await categoryRepository.update(
        { subcategoryid: payload.subcategoryid },
        updatePayload
      );
      res.status(200).send({
        IsSuccess: "subcategory Details updated SuccessFully",
      });
      return;
    }
    const validation = categorynestedValidation.validate(payload);
    if (validation?.error) {
      throw new ValidationException(validation.error.message);
    }
    const validateTypeName = await categoryRepository.findBy({
      categoryname: payload.categoryname,
    });
    if (validateTypeName?.length) {
      throw new ValidationException("categoryname already exist");
    }

    const { subcategoryid, ...updatePayload } = payload;
    await categoryRepository.save(updatePayload);
    res.status(200).send({
      IsSuccess: "subcategory  Details added SuccessFully",
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

export const deleteSubCategory = async (req: Request, res: Response) => {
  const id = req.params.subcategoryid;
  const categoryRepo = appSource.getRepository(CategoryNested);
  try {
    const typeNameFromDb = await categoryRepo
      .createQueryBuilder("CategoryNested")
      .where("CategoryNested.subcategoryid = :subcategoryid", {
        subcategoryid: id,
      })
      .getOne();
    if (!typeNameFromDb?.subcategoryid) {
      throw new HttpException("brand not Found", 400);
    }
    await categoryRepo
      .createQueryBuilder("CategoryNested")
      .delete()
      .from(CategoryNested)
      .where("subcategoryid = :subcategoryid", { subcategoryid: id })
      .execute();
    res.status(200).send({
      IsSuccess: `subcategory  deleted successfully!`,
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

export const changeSubCategoryStatus = async (req: Request, res: Response) => {
  const subCategoryStatus: changenestedCategroyStatusDto = req.body;
  const categoryRepository = appSource.getRepository(CategoryNested);

  try {
    const categoryFromDB = await categoryRepository.findBy({
      subcategoryid: subCategoryStatus.subcategoryid,
    });
    if (categoryFromDB.length == 0) {
      throw new HttpException("Data not Found", 400);
    }
    await categoryRepository
      .createQueryBuilder()
      .update(CategoryNested)
      .set({ status: subCategoryStatus.status })
      .where({ subcategoryid: subCategoryStatus.subcategoryid })
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

import { appSource } from "../../core/db";
import { HttpException, ValidationException } from "../../core/exception";
import { Request, Response } from "express";
import {
  CategoryDto,
  categoryUpdateValidation,
  categoryValidation,
  changeCategroyStatusDto,
} from "./category.dto";
import { Category } from "./category.model";
// import { console } from "inspector/promises";
import { CategoryNested } from "../categoryNested/categoryNested.model";
import { products } from "../productModule/product.model";
import { Not } from "typeorm";
import { LogsDto } from "../logs/logs.dto";
import { InsertLog } from "../logs/logs.service";

export const addCategory = async (req: Request, res: Response) => {
  const payload: CategoryDto = req.body;
  const userId = payload.categoryid ? payload.muid : payload.cuid;

  try {
    const categoryRepository = appSource.getRepository(Category);

    if (payload.categoryid) {
      const validation = categoryUpdateValidation.validate(payload);
      if (validation?.error) {
        throw new ValidationException(validation.error.message);
      }
      const category = await categoryRepository.findOneBy({
        categoryid: payload.categoryid,
      });
      if (!category?.categoryid) {
        throw new ValidationException("category  not found");
      }

      const categoryNameValiadtion = await categoryRepository.findBy({
        categoryname: payload.categoryname,
        categoryid: Not(payload.categoryid),
      });
      if (categoryNameValiadtion?.length) {
        throw new ValidationException("category name already  exists");
      }
      const { cuid, categoryid, ...updatePayload } = payload;
      await categoryRepository.update(
        { categoryid: payload.categoryid },
        updatePayload
      );
      const logsPayload: LogsDto = {
        userId: userId,
        userName: '',
        statusCode: 200,
        message: `Category ${payload.categoryname} updated by -`
      }
      await InsertLog(logsPayload);
      res.status(200).send({
        IsSuccess: "Category Details updated SuccessFully",
      });
      return;
    }
    const validation = categoryValidation.validate(payload);
    if (validation?.error) {
      throw new ValidationException(validation.error.message);
    }
    const validateTypeName = await categoryRepository.findBy({
      categoryname: payload.categoryname,
    });
    if (validateTypeName?.length) {
      throw new ValidationException("category name  already exist");
    }

    const { categoryid, ...updatePayload } = payload;
    await categoryRepository.save(updatePayload);
    res.status(200).send({
      IsSuccess: "Category  Details added SuccessFully",
    });
    const logsPayload: LogsDto = {
      userId: userId,
      userName: '',
      statusCode: 200,
      message: `Category ${payload.categoryname} added by -`
    }
    await InsertLog(logsPayload);
  } catch (error) {
    const logsPayload: LogsDto = {
      userId: userId,
      userName: '',
      statusCode: 500,
      message: `Error while saving Category ${payload.categoryname} by -`
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

export const getCategory = async (req: Request, res: Response) => {
  try {
    const Repository = appSource.getRepository(Category);
    const categoryNestedRepoisstry = appSource.getRepository(CategoryNested);
    const category = await Repository.query(
      `select * from [${process.env.DB_NAME}].[dbo].category  ORDER BY categoryname ASC`
    );
    const subCategory = await categoryNestedRepoisstry.query(`
       select * from [${process.env.DB_NAME}].[dbo].category_nested ORDER BY categoryname ASC
      `);

    if (subCategory.length > 0) {
      category.push(...subCategory);
    }

    let sortedList = category.sort(function (a: any, b: any) {
      const nameA = a.categoryname.toUpperCase(); // ignore upper and lowercase
      const nameB = b.categoryname.toUpperCase(); // ignore upper and lowercase

      // sort in an ascending order
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      // names must be equal
      return 0;
    });

    res.status(200).send({
      Result: sortedList,
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

export const getHeaderCategory = async (req: Request, res: Response) => {
  try {
    const Repository = appSource.getRepository(Category);
    const categoryNestedRepoisstry = appSource.getRepository(CategoryNested);
    const category = await Repository.query(
      `select * from [${process.env.DB_NAME}].[dbo].category  ORDER BY categoryname ASC`
    );
    const subCategory = await categoryNestedRepoisstry.query(`
       select * from [${process.env.DB_NAME}].[dbo].category_nested ORDER BY categoryname ASC
      `);

    if (subCategory.length > 0) {
      for (const sub of subCategory) {
        const categoryId = sub.parentcategory;
        category.forEach((x: any) => {
          if (x.categoryid == categoryId) {
            if (!x.subCategory) {
              x.subCategory = []; // initialize if undefined
            }
            x.subCategory.push(sub);
          }
        });
      }
    }
    res.status(200).send({
      Result: category,
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

export const deleteCategory = async (req: Request, res: Response) => {
  const categoryid = Number(req.params.categoryid);
  const userId = Number(req.params.userId);
  if (isNaN(categoryid)) {
    return res.status(400).send({ message: "Invalid category ID" });
  }
  const categoryRepo = appSource.getRepository(Category);
  const productRepo = appSource.getRepository(products);
  const category = await categoryRepo.findOneBy({ categoryid: categoryid });
  if (!category) {
    throw new ValidationException("Category not found");
  }
  try {
    // Step 1: Fetch category by ID

    // const categoryName = category.categoryname.trim().toLowerCase();
    // Step 2: Check if any products use this category name
    const usedInProducts = await productRepo
      .createQueryBuilder("product")
      .where("product.categoryid= :categoryid", {
        categoryid,
      })
      .getCount(); // More efficient than getMany if we only need count
    if (usedInProducts > 0) {
      throw new ValidationException(
        "Unable to delete category. It is currently used by products."
      );
    }
    // Step 3: Delete the category
    await categoryRepo
      .createQueryBuilder()
      .delete()
      .from(Category)
      .where({ categoryid: categoryid })
      .execute();

    const logsPayload: LogsDto = {
      userId: userId,
      userName: '',
      statusCode: 200,
      message: `Category ${category.categoryname} deleted by -`
    }
    await InsertLog(logsPayload);

    res.status(200).send({
      IsSuccess: `Category ${category.categoryname} deleted successfully!`,
    });
  } catch (error) {
    const logsPayload: LogsDto = {
      userId: userId,
      userName: '',
      statusCode: 500,
      message: `Error while deleting Category ${category.categoryname}  by -`
    }
    await InsertLog(logsPayload);
    if (error instanceof ValidationException) {
      return res.status(400).send({ message: error.message });
    }
    res.status(500).send(error);
  }
};

export const changeStatusCategory = async (req: Request, res: Response) => {
  const categoryStatus: changeCategroyStatusDto = req.body;
  const categoryRepository = appSource.getRepository(Category);
  const categoryFromDB = await categoryRepository.findOneBy({
    categoryid: categoryStatus.categoryid,
  });
  if (!categoryFromDB) {
    throw new HttpException("Data not Found", 404);
  }
  try {

    await categoryRepository
      .createQueryBuilder()
      .update(Category)
      .set({ status: categoryStatus.status })
      .where({ categoryid: categoryStatus.categoryid })
      .execute();

    const logsPayload: LogsDto = {
      userId: Number(categoryStatus.userId),
      userName: '',
      statusCode: 200,
      message: `Category ${categoryFromDB.categoryname} status changed to ${categoryStatus.status} by -`
    }
    await InsertLog(logsPayload);

    res.status(200).send({
      IsSuccess: `Status for ${categoryFromDB.categoryname} Updated successfully!`,
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

export const getCatAndSubcat = async (req: Request, res: Response) => {
  try {
    const categoryRepository = appSource.getRepository(Category);
    const details: CategoryDto[] = await categoryRepository.query(
      ` 
/****** Script for SelectTopNRows command from SSMS  ******/
SELECT TOP 7 [categoryid]
      ,[categoryname]
      ,[categoryicon]
      ,[status]
      ,[cuid]
      ,[muid]
      ,[created_at]
      ,[updated_at]
  FROM [${process.env.DB_name}].[dbo].[category]
  ORDER BY created_at`
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

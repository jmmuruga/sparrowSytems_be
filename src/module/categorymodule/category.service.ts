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
import { console } from "inspector/promises";
import { CategoryNested } from "../categoryNested/categoryNested.model";
import { products } from "../productModule/product.model";

export const addCategory = async (req: Request, res: Response) => {
  const payload: CategoryDto = req.body;
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
      const { cuid, categoryid, ...updatePayload } = payload;
      await categoryRepository.update(
        { categoryid: payload.categoryid },
        updatePayload
      );
      res.status(200).send({
        IsSuccess: "category Details updated SuccessFully",
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
      IsSuccess: "category  Details added SuccessFully",
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
  console.log(categoryid)
  if (isNaN(categoryid)) {
    return res.status(400).send({ message: "Invalid category ID" });
  }
  const categoryRepo = appSource.getRepository(Category);
  const productRepo = appSource.getRepository(products);
  try {
    // Step 1: Fetch category by ID
    const category = await categoryRepo.findOneBy({ categoryid });
    if (!category) {
      throw new HttpException("Category not found", 400);
    }
    // const categoryName = category.categoryname.trim().toLowerCase();
    // Step 2: Check if any products use this category name
    const usedInProducts = await productRepo
      .createQueryBuilder("product")
      .where("product.category_name= :categoryid", {
       categoryid,
      })
      .getCount(); // More efficient than getMany if we only need count
    if (usedInProducts > 0) {
      throw new HttpException("Unable to delete category. It is currently used by products.",400);
    }
    // Step 3: Delete the category
    await categoryRepo.delete({ categoryid });
    res.status(200).send({
      IsSuccess: "Category deleted successfully!",
    });
  } catch (error) {
    if (error instanceof ValidationException) {
      return res.status(400).send({ message: error.message });
    }
    res.status(500).send(error);
  }
};

export const changeStatusCategory = async (req: Request, res: Response) => {
  const categoryStatus: changeCategroyStatusDto = req.body;
  const categoryRepository = appSource.getRepository(Category);

  try {
    const categoryFromDB = await categoryRepository.findBy({
      categoryid: categoryStatus.categoryid,
    });
    if (categoryFromDB.length == 0) {
      throw new HttpException("Data not Found", 400);
    }
    await categoryRepository
      .createQueryBuilder()
      .update(Category)
      .set({ status: categoryStatus.status })
      .where({ categoryid: categoryStatus.categoryid })
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

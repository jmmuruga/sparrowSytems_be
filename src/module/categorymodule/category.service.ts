import { appSource } from "../../core/db";
import { HttpException, ValidationException } from "../../core/exception";
import { Request, Response } from "express";
import { CategoryDto, categoryUpdateValidation, categoryValidation, changeCategroyStatusDto } from "./category.dto";
import { Category } from "./category.model";
import { console } from "inspector/promises";



export const addCategory = async (req: Request, res: Response) => {
  const payload: CategoryDto = req.body;
  try {
 
    const categoryRepository = appSource.getRepository(Category);

   if(payload.categoryid){
     
       const validation =  categoryUpdateValidation.validate(payload);
       if (validation?.error) {
         throw new ValidationException(validation.error.message);
      }
       const category  = await categoryRepository.findOneBy({
         categoryid : payload.categoryid
       });
     if(!category ?.categoryid){
         throw new ValidationException("category  not found");
       }
       const { cuid, categoryid, ...updatePayload } = payload;
      await categoryRepository.update({ categoryid: payload.categoryid }, updatePayload);
      res.status(200).send({
        IsSuccess: "category Details updated SuccessFully",
      });
      return;
    }
    const validation = categoryValidation.validate(payload);
    if (validation?.error) {
      throw new ValidationException(validation.error.message);
    }
    
    const { categoryid, ...updatePayload } = payload;
    await categoryRepository.save(updatePayload);
    res.status(200).send({
      IsSuccess: "category  Details added SuccessFully",
    });
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





export const getCategory = async (req: Request, res: Response) => {
  try{
    const Repository = appSource.getRepository(Category);
    const category = await Repository.createQueryBuilder("category").orderBy("category.categoryname","ASC").getMany();
    
    res.status(200).send({
      Result: category,
  })

}
catch (error) {
  if (error instanceof ValidationException) {
      return res.status(400).send({
          message: error?.message,
      });
  }
  res.status(500).send(error);
}
};

export const deleteCategory = async (req: Request, res: Response) => {
  const id = req.params.categoryid;
  const categoryRepo = appSource.getRepository(Category);
  try {
      const typeNameFromDb = await  categoryRepo
          .createQueryBuilder('Category')
          .where("category.categoryid = :categoryid", {
            categoryid : id,
          })
          .getOne();
      if (!typeNameFromDb?.categoryid) {
          throw new HttpException("brand not Found", 400);
      }
      await  categoryRepo
          .createQueryBuilder("Category")
          .delete()
          .from(Category)
          .where("categoryid = :categoryid", { categoryid: id })
          .execute();
      res.status(200).send({
          IsSuccess: `category deleted successfully!`,
      });
  }
  catch (error) {
      if (error instanceof ValidationException) {
          return res.status(400).send({
              message: error?.message,
          });
      }
      res.status(500).send(error);
  }
}




export const changeStatusCategory = async (req: Request, res: Response) => {
   const categoryStatus : changeCategroyStatusDto = req.body;
  const categoryRepository = appSource.getRepository(Category);

  try {
      const categoryFromDB = await categoryRepository.findBy({
          categoryid : categoryStatus.categoryid,
      })
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
  }
  catch (error) {
      if (error instanceof ValidationException) {
          return res.status(400).send({
              message: error?.message,
          });
      }
      res.status(500).send(error);
  }
}





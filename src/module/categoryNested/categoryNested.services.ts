import { appSource } from "../../core/db";
import { HttpException, ValidationException } from "../../core/exception";
import { Request, Response } from "express";
import { CategoryNestedDto, categorynestedUpdateValidation, categorynestedValidation } from "./categoryNested.dto";
import { CategoryNested } from "./categoryNested.model";



export const addsubCategory = async (req: Request, res: Response) => {
  const payload: CategoryNestedDto = req.body;
  try {
 
    const categoryRepository = appSource.getRepository(CategoryNested);

   if(payload.subcategoryid){
     
       const validation = categorynestedUpdateValidation.validate(payload);
       if (validation?.error) {
         throw new ValidationException(validation.error.message);
      }
       const category  = await categoryRepository.findOneBy({
         subcategoryid : payload.subcategoryid
       });
     if(!category ?.subcategoryid){
         throw new ValidationException("sub category   not found");
       }
       const { cuid, subcategoryid, ...updatePayload } = payload;
      await categoryRepository.update({ subcategoryid: payload.subcategoryid }, updatePayload);
      res.status(200).send({
        IsSuccess: "subcategory Details updated SuccessFully",
      });
      return;
    }
    const validation = categorynestedValidation.validate(payload);
    if (validation?.error) {
      throw new ValidationException(validation.error.message);
    }
    
    const { subcategoryid, ...updatePayload } = payload;
    await categoryRepository.save(updatePayload);
    res.status(200).send({
      IsSuccess: "subcategory  Details added SuccessFully",
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
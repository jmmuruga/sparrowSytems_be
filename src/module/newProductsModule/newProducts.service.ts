import { appSource } from "../../core/db";
import { Request, Response } from "express";
import { NewProductsDto, newProductsDtoValidation, updateNewProductsValidation } from "./newProducts.dto";
import { Newproducts } from "./newProducts.model";
import { ValidationException } from "../../core/exception";


export const addNewProducts = async (req: Request, res: Response) => {
    const payload: NewProductsDto = req.body;
    const newProductsRepository = appSource.getRepository(Newproducts);
    try {
        if (payload.id) {
            console.log("Updating New Products settings");

            const updateError  = updateNewProductsValidation.validate(payload);
            if (updateError.error) {
                throw new ValidationException(updateError.error.message);
            }

            const existingSettings = await newProductsRepository.findOneBy({ id: payload.id });
            if (!existingSettings) {
                throw new ValidationException("New Products settings not found");
            }

            const { id, ...updatePayload } = payload;
            await newProductsRepository.update({ id }, updatePayload);

            return res.status(200).send({
                message: "New Products settings updated successfully",
            });
        }

        // add new
        const  validation  = newProductsDtoValidation.validate(payload);
        if (validation.error) {
            throw new ValidationException(validation.error.message);
        }

        await newProductsRepository.save(payload)

        return res.status(200).send({
            message: "New Products settings added successfully",
        });

    } catch (error) {
        console.error("Error adding New Products settings:", error);
        if (error instanceof ValidationException) {
            return res.status(400).send({
                message: error.message,
            });
        }
        return res.status(500).send({
            message: "Internal server error",
        });
    }
};

export const getNewProductsDetails = async (req: Request, res: Response) => {
  try {
    const Repository = appSource.getRepository(Newproducts);
    const newProductsList = await Repository.createQueryBuilder().getMany();

    res.status(200).send({
      Result: newProductsList,
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
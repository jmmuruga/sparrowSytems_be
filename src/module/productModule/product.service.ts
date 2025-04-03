import { appSource } from "../../core/db";
import { HttpException, ValidationException } from "../../core/exception";
import { Request, Response } from "express";
import { productDetailsDto, productDetalsValidation } from "./product.dto";
import { products } from "./product.model";

export const addProduct = async (req: Request, res: Response) => {
  const payload: productDetailsDto = req.body;

  try {
      // Validate request payload
      const validation = productDetalsValidation.validate(payload);
      if (validation?.error) {
          throw new ValidationException(validation.error.message);
      }

      const ProductRepository = appSource.getRepository(products);

      // Remove `productid` from the payload (it is auto-generated)
      const { productid, ...updatePayload } = payload;

      // Save the product
      const newProduct = ProductRepository.create(updatePayload);
      await ProductRepository.save(newProduct);

      return res.status(201).json({
          success: true,
          message: "Product added successfully",
          data: newProduct, // Return saved product details
      });

  } catch (error) {
      if (error instanceof ValidationException) {
          return res.status(400).json({ success: false, message: error.message });
      }
      console.error("Error adding product:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
  
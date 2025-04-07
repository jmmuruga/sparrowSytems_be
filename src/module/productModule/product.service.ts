import { appSource } from "../../core/db";
import { HttpException, ValidationException } from "../../core/exception";
import { Request, Response } from "express";
import { productDetailsDto, productDetalsValidation } from "./product.dto";
import { products } from "./product.model";



export const addProduct = async (req: Request, res: Response) => {
    try {
        const payload: productDetailsDto = req.body;
       console.log("called" );
       const validation = productDetalsValidation.validate(payload);
        if (validation.error) {
            console.warn("❌ Validation error:", validation.error.message);
            throw new ValidationException(validation.error.message);
        }
    } catch (error) {
        if (error instanceof ValidationException) {
            return res.status(400).json({ success: false, message: error.message });
        }

        // Log all other unexpected errors
        console.error("🔥 Unexpected error while adding product:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};


  
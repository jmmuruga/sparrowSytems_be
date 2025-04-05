import { appSource } from "../../core/db";
import { HttpException, ValidationException } from "../../core/exception";
import { Request, Response } from "express";
import { productDetailsDto, productDetalsValidation } from "./product.dto";
import { products } from "./product.model";



export const addProduct = async (req: Request, res: Response) => {
    try {
        // Step 1: Log the incoming request body
        console.log("📦 Incoming Product Payload:", JSON.stringify(req.body, null, 2));

        const payload: productDetailsDto = req.body;

        // Step 2: Validate request payload
        const validation = productDetalsValidation.validate(payload, { abortEarly: false });
        if (validation.error) {
            console.warn("❌ Validation error:", validation.error.details);
            throw new ValidationException(validation.error.message);
        }

        const ProductRepository = appSource.getRepository(products);

        // Step 3: Remove auto-generated productid if it exists
        const { productid, ...cleanedPayload } = validation.value;

        // Step 4: Create and save product
        const newProduct = ProductRepository.create(cleanedPayload);
        await ProductRepository.save(newProduct);

        return res.status(201).json({
            success: true,
            message: "Product added successfully",
            data: newProduct,
        });

    } catch (error) {
        if (error instanceof ValidationException) {
            return res.status(400).json({ success: false, message: error.message });
        }

        // Log all other unexpected errors
        console.error("🔥 Unexpected error while adding product:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};


  
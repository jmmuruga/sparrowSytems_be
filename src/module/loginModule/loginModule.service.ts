import { Request, Response } from "express";
import { appSource } from "../../core/db";
import { UserDetails } from "../userDetails/userDetails.model";
import { ValidationException } from "../../core/exception";
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { resetPasswordValidation } from "../userDetails/userDetails.dto";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();  // Ensure env variables are loaded

// Utility function for error handling
const handleError = (res: Response, error: any) => {
    console.error("Error:", error);
    if (error instanceof ValidationException) {
        return res.status(400).send({ message: error.message });
    }
    res.status(500).send({ message: "Internal server error" });
};

export const login = async (req: Request, res: Response) => {
    try {
        const { e_mail, password } = req.body;

        const userRepository = appSource.getRepository(UserDetails);
        const user = await userRepository.findOneBy({ e_mail });

        if (!user) {
            throw new ValidationException("Invalid Email!");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new ValidationException("Invalid Password!");
        }

        const jwtSecret = process.env.JWT_SECRET_KEY;
        if (!jwtSecret) {
            throw new Error("JWT secret key is not configured.");
        }

        const token = jwt.sign(
            { id: user.userid, email: user.e_mail },
            jwtSecret,
            { expiresIn: "1h" }
        );

        res.status(200).send({
            Result: {
                id: user.userid,
                user_name: user.user_name,
                token,
                status: "Login Success"
            },
        });

    } catch (error) {
        handleError(res, error);
    }
};

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { e_mail } = req.body;

        if (!e_mail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e_mail)) {
            throw new ValidationException("Invalid Email format!");
        }

        const repo = appSource.getRepository(UserDetails);
        const user = await repo.findOneBy({ e_mail });

        if (!user) {
            throw new ValidationException("Email not found!");
        }

        const randomOtp = String(Math.floor(100000 + Math.random() * 900000));
        const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes validity

        // Store OTP temporarily (improve this by saving in DB)
        const otpStore = {
            otp: randomOtp,
            expiresAt,
        };

        // Use environment variables for email credentials
        const transporter = nodemailer.createTransport({
            service: "gmail",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,   // Use environment variables
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: e_mail,
            subject: "Password Recovery Assistance",
            text: `Hello ${user.user_name},\n\n
            We received a request to reset your password. Please use the following OTP to reset your password:\n
            OTP: ${randomOtp}\n\n
            This OTP is valid for 10 minutes.\n\n
            Best regards,\nSaveData InfoTech Solutions`
        });

        res.status(200).send({
            IsSuccess: true,
            message: "OTP sent successfully"
        });

    } catch (error) {
        handleError(res, error);
    }
};

export const resetNewPassword = async (req: Request, res: Response) => {
    try {
        const { userid, newPassword, muid } = req.body;

        const validation = resetPasswordValidation.validate({ userid, newPassword });
        if (validation.error) {
            throw new ValidationException(validation.error.message);
        }

        const userRepository = appSource.getRepository(UserDetails);
        const user = await userRepository.findOneBy({ userid });

        if (!user) {
            throw new ValidationException("Invalid User!");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await userRepository.update({ userid }, { password: hashedPassword, muid });

        res.status(200).send({
            IsSuccess: true,
            message: "Password updated successfully"
        });

    } catch (error) {
        handleError(res, error);
    }
};

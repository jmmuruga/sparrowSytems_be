import { Request, Response } from "express";
import { appSource } from "../../core/db";
import { UserDetails } from "../userDetails/userDetails.model";
import { ValidationException } from "../../core/exception";
import nodemailer from 'nodemailer';
// import jwt from 'jsonwebtoken';
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
        const { email, password } = req.body;
        console.log(email , password)
        const userRepository = appSource.getRepository(UserDetails);
        const user = await userRepository.findOneBy({ email  : email});

        if (!user) {
            throw new ValidationException("Invalid Email!");
        }

       if(user.password != password){
        console.log(user.password , password , 'pass')
        throw new ValidationException("Incorrect Password!");
       }

        res.status(200).send({
            Result: {
                id: user.userid,
                user_name: user.user_name,
                status: "Login Success"
            },
        });

    } catch (error) {
        handleError(res, error);
    }
};

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new ValidationException("Invalid Email format!");
        }

        const repo = appSource.getRepository(UserDetails);
        const user = await repo.findOneBy({ email });

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
            to: email,
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

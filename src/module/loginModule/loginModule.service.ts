import { Request, Response } from "express";
import { appSource } from "../../core/db";
import { UserDetails } from "../userDetails/userDetails.model";
import { ValidationException } from "../../core/exception";
import nodemailer from 'nodemailer';
// import jwt from 'jsonwebtoken';
import { resetPasswordValidation } from "../userDetails/userDetails.dto";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { LogsDto } from "../logs/logs.dto";
import { InsertLog } from "../logs/logs.service";

dotenv.config();  // Ensure env variables are loaded

// Utility function for error handling
const handleError = (res: Response, error: any) => {
    if (error instanceof ValidationException) {
        return res.status(400).send({ message: error.message });
    }
    res.status(500).send({ message: "Internal server error" });
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    
    const userRepository = appSource.getRepository(UserDetails);
    const user = await userRepository.findOneBy({ email: email });

    try {
        if (!user) {
            throw new ValidationException("Invalid Email!");
        }
        if (user.password != password) {
            throw new ValidationException("Incorrect Password!");
        }

        const token = jwt.sign(
            { id: user.userid, email: user.email },
            process.env.JWT_SECRET_KEY as string
        );
        // logs
        const now = new Date().toLocaleTimeString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        })
        const logsPayload: LogsDto = {
            userId: user.userid,
            userName: '',
            statusCode: 200,
            message: `Session started at ${now} by user - `
        }
        await InsertLog(logsPayload);

        res.status(200).send({
            Result: {
                userid: user.userid,
                email: user.email,
                status: "Login Success",
                token: token
            },
        });

    } catch (error) {
        // logs
        const errorMessage = (error as Error).message;
        const logPayload: LogsDto = {
            userId: user?.userid || 0,
            userName: '',
            statusCode: 400,
            message: `Error while starting the session - ${errorMessage} by user - `
        }
        await InsertLog(logPayload);
        handleError(res, error);
    }
};

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const eMail = req.params.email;
        const randomOtp = String(Math.floor(100000 + Math.random() * 900000));
        const repo = appSource.getRepository(UserDetails);
        const isThereEmail = await repo.findOneBy({
            email: eMail
        });
        if (!isThereEmail) {
            throw new ValidationException('Invalid Email !');
        }

        if (isThereEmail) {
         const transporter = nodemailer.createTransport({
                service: "gmail",
                port: 465,
                secure: false,
                auth: {
                    user: "savedatain@gmail.com",
                    pass: "unpk bcsy ibhp wzrm",
                },
            });

            await transporter.sendMail({
                from: "savedatain@gmail.com",
                // to: "isThereEmail",
                to: eMail,
                subject: `Password Recovery Assistance`,
                text: `Hello,\n\n
                We received a request to reset your password. Please use the following One-Time Password (OTP) to log in and reset your password:\n
                OTP: ${randomOtp}\n\n
                This OTP is valid for a limited time. After logging in, we recommend that you update your password for security purposes.\n\n
                If you did not request a password reset, please contact our support team.\n\n
                Best regards,\nSaveData InfoTech Solutions`
            });
        }
        res.status(200).send({
           otp: randomOtp,
            IsSuccess: true,
            user_details: { user_name: isThereEmail.username, userid: isThereEmail.userid },
            Result: "Mail sent successfully"
        });
    }
    catch (error) {
        handleError(res, error);
    }
}

export const addLogsWhileLogout = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const now = new Date().toLocaleTimeString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        })
        const logsPayload: LogsDto = {
            userId: Number(userId),
            userName: '',
            statusCode: 200,
            message: `Session ends at ${now} by user - `,
        }
        await InsertLog(logsPayload);
        res.status(200).send({
            Result: "Logout Success"
        });
    }
    catch (error) {
        handleError(res, error);
    }
}



export const sendOtp = async (req: Request, res: Response) => {
    try {
        const email = req.params.email;
        const randomOtp = String(Math.floor(100000 + Math.random() * 900000));
        // const repo = appSource.getRepository(UserDetails);
        // const isThereEmail = await repo.findOneBy({
        //     email: eMail
        // });
        // if (!isThereEmail) {
        //     throw new ValidationException('Invalid Email !');
        // }

       
         const transporter = nodemailer.createTransport({
                service: "gmail",
                port: 465,
                secure: false,
                auth: {
                    user: "savedatain@gmail.com",
                    pass: "unpk bcsy ibhp wzrm",
                },
            });

            await transporter.sendMail({
                from: "savedatain@gmail.com",
                // to: "isThereEmail",
                to: email,
                subject: `Password Recovery Assistance`,
                text: `Generated OTP for verification  ${randomOtp} Please use this OTP to verify`
            });
       
        res.status(200).send({
        //    otp: randomOtp,
        //     IsSuccess: true,
            // user_details: { user_name: isThereEmail.username, userid: isThereEmail.userid },
            Result:randomOtp 
        });
    }
    catch (error) {
        handleError(res, error);
    }
}

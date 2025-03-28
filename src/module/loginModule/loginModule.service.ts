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
        const { email, password } = req.params;
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
                secure: true,
                auth: {
                    user: "savedatain@gmail.com",
                    pass: "mqks tltb abyk jlyw",
                },
            });

            await transporter.sendMail({
                from: "savedatain@gmail.com",
                to: eMail,
                subject: `Password Recovery Assistance`,
                text: `Hello ${isThereEmail.user_name},\n\n
                We received a request to reset your password. Please use the following One-Time Password (OTP) to log in and reset your password:\n
                OTP: ${randomOtp}\n\n
                This OTP is valid for a limited time. After logging in, we recommend that you update your password for security purposes.\n\n
                If you did not request a password reset, please contact our support team.\n\n
                Best regards,\nSaveData InfoTech Solutions`
            });
        }
        console.log(isThereEmail.userid, "forget pawd")
        res.status(200).send({
            IsSuccess: true,
            otp: randomOtp,
            user_details: { user_name: isThereEmail.user_name, userid: isThereEmail.userid },
            Result: "Mail sent successfully"
        });
    }
    catch (error) {
        handleError(res, error);
    }
}

export const resetNewPassword = async (req: Request, res: Response) => {
    const data = req.body;
    try {
        const validation = resetPasswordValidation.validate(data);
        if (validation?.error) {
            throw new ValidationException(
                validation.error.message
            );
        }
        const UserDetailsRepoistry = appSource.getRepository(UserDetails);
        const userDetailsDetails = await UserDetailsRepoistry.createQueryBuilder('UserDetails')
            .where("UserDetails.userid = :userid", {
                userid: data.userid,
            }).getOne();

        if (!userDetailsDetails) {
            throw new ValidationException('Invalid User !');
        }

        await UserDetailsRepoistry
            .update({ userid: data.userid }, { password: data.password, confirmPassword : data.password, muid: data.muid })
            .then((r) => {
                res.status(200).send({
                    IsSuccess: "Password Updated successfully",
                });
            })
            .catch((error) => {
                if (error instanceof ValidationException) {
                    return res.status(400).send({
                        message: error?.message,
                    });
                }
                res.status(500).send(error);
            });
    }
    catch (error) {
        handleError(res, error);
    }
}

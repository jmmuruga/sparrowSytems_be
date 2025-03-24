import { appSource } from "../../core/db";
import { HttpException, ValidationException } from "../../core/exception";
import { userDetailsDto, userDetailsValidation } from "./userDetails.dto";
import { Request, Response } from "express";
import { UserDetails } from "./userDetails.model";

export const newUser = async (req: Request, res: Response) => {
    const newDataobj = req.body;
    const payload: userDetailsDto = newDataobj;
    try {
        const validation = userDetailsValidation.validate(payload);
        if (validation?.error) {
            throw new ValidationException(validation.error.message);
        }

        const UserDetailsRepoistry = appSource.getRepository(UserDetails);
        const validateTypeName = await UserDetailsRepoistry.findBy({
            e_mail: payload.e_mail,
        });

        if (validateTypeName?.length) {
            throw new ValidationException("E-mail already exists");
        }

        const { userid, ...updatePayload } = payload;
        await UserDetailsRepoistry.save(updatePayload);

        res.status(200).send({
            IsSuccess: "User Details added Successfully",
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



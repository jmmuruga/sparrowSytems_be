import { NextFunction } from "express";
import { UnauthenticatedException } from "../core/exception";
import jwt from 'jsonwebtoken';
import { UserDetails } from "../module/userDetails/userDetails.model";
import { appSource } from "../core/db";
import { Request, Response } from "express";

export const auth = (req: Request, res: Response, next: NextFunction) => {
    try {
        const bearerToken = req.headers.authorization?.split("Bearer ")[1];
        if (!bearerToken) {
            throw new UnauthenticatedException("Unauthenticated access");
        }
        const jwtVerification = jwt.verify(
            bearerToken,
            process.env.JWT_SECRET_KEY as string
        );
        if (typeof jwtVerification === "string" || !jwtVerification) {
            throw new UnauthenticatedException("Unauthenticated access");
        }
        console.log(jwtVerification , 'jwt verification result')
        const userRepository = appSource.getRepository(UserDetails);
        const user = userRepository.findOneBy({
            userid: jwtVerification?.id,
        });
        if (!user) {
            throw new UnauthenticatedException("Unauthenticated access");
        }
        res.locals.user = user;
        next();
    } catch (error) {
        res.status(401).send({ message: "Unauthenticated" });
    }
};
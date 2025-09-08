import { NextFunction } from "express";
import { UnauthenticatedException } from "../core/exception";
import jwt from 'jsonwebtoken';
import { UserDetails } from "../module/userDetails/userDetails.model";
import { appSource } from "../core/db";
import { Request, Response } from "express";
import * as crypto from "crypto";

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
         // Check if jwtVerification is a string or undefined
        if (typeof jwtVerification === "string" || !jwtVerification) {
            throw new UnauthenticatedException("Unauthenticated access");
        }
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



export function encryptString(data: string, secreatKet: string) {
  const algorithm = process.env.algorithm as  string
  const key = Buffer.from(
    "52d1542a9ee07bb807375a552983abf2386dc5e1e7ddc66dfb78b3c8533ee63b",
    "hex"
  );
  const iv = Buffer.from("ef953c62cfcff791f31efe8cd91ac20d", "hex");
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encryptData = cipher.update(data, "utf-8", "hex");
  encryptData += cipher.final("hex");
  return encryptData;
}
import { Request, Response } from "express";
import { bannerDetailsDto, bannerDetailsValidation } from "./banner.dto";
import { ValidationException } from "../../core/exception";
import { appSource } from "../../core/db";
import { banner } from "./banner.model";

export const newBanner = async (req: Request, res: Response) => {
    const payload: bannerDetailsDto = req.body;

    try {
        // Validate incoming data
        const validation = bannerDetailsValidation.validate(payload);
        if (validation?.error) {
            throw new ValidationException(validation.error.message);
        }

        const bannerRepo = appSource.getRepository(banner);

        if (payload.banner_id > 0) {
            const existingBanner = await bannerRepo.findOneBy({ bannerid: payload.banner_id });

            if (existingBanner) {
                const { banner_id, cuid, ...updatePayload } = payload;
                await bannerRepo.update({ bannerid: payload.banner_id }, updatePayload);

                return res.status(200).send({ IsSuccess: "Banner updated successfully" });
            } else {
                return res.status(404).send({ message: "Banner not found" });
            }

        } else {
            // const { banner_id, ...newBannerPayload } = payload;
            // const newBanner = bannerRepo.create(newBannerPayload);
            await bannerRepo.save(payload);

            return res.status(200).send({ IsSuccess: "Banner added successfully" });
        }
    } catch (error) {
        if (error instanceof ValidationException) {
            return res.status(400).send({ message: error.message });
        }
        return res.status(500).send({ message: "Internal server error" });
    }
};

export const getBannerDetail = async (req: Request, res: Response) => {
    try {
        const Repository = appSource.getRepository(banner);
        const bannerList = await Repository
            .createQueryBuilder()
            .getMany();

        res.status(200).send({
            Result: bannerList
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

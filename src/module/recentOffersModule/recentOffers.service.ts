import { appSource } from "../../core/db";
import { Request, Response } from "express";
import { RecentOffersDto, recentOffersDtoValidation, updateRecentOffersValidation } from "./recentOffers.dto";
import { RecentOffers } from "./recentOffers.model";
import { ValidationException } from "../../core/exception";


export const addRecentOffersSettings = async (req: Request, res: Response) => {
    const payload: RecentOffersDto = req.body;
    const recentOffersRepository = appSource.getRepository(RecentOffers);
    try {
        if (payload.id) {
            console.log("Updating Recent Offers settings");

            const updateError  = updateRecentOffersValidation.validate(payload);
            if (updateError.error) {
                throw new ValidationException(updateError.error.message);
            }

            const existingSettings = await recentOffersRepository.findOneBy({ id: payload.id });
            if (!existingSettings) {
                throw new ValidationException("Recent Offers settings not found");
            }

            const { id, ...updatePayload } = payload;
            await recentOffersRepository.update({ id }, updatePayload);

            return res.status(200).send({
                message: "Recent Offers settings updated successfully",
            });
        }

        // add new
        const  validation  = recentOffersDtoValidation.validate(payload);
        if (validation.error) {
            throw new ValidationException(validation.error.message);
        }

        await recentOffersRepository.save(payload)

        return res.status(200).send({
            message: "Recent Offers settings added successfully",
        });

    } catch (error) {
        console.error("Error adding Recent Offers settings:", error);
        if (error instanceof ValidationException) {
            return res.status(400).send({
                message: error.message,
            });
        }
        return res.status(500).send({
            message: "Internal server error",
        });
    }
};

export const getRecentOffersDetails = async (req: Request, res: Response) => {
  try {
    const Repository = appSource.getRepository(RecentOffers);
    const recentOffersList = await Repository.createQueryBuilder().getMany();

    res.status(200).send({
      Result: recentOffersList,
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

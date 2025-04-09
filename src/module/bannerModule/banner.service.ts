import { Request, Response } from "express";
import { bannerDetailsDto, bannerDetailsValidation, updateBannerValidation } from "./banner.dto";
import { HttpException, ValidationException } from "../../core/exception";
import { appSource } from "../../core/db";
import { banner } from "./banner.model";

// export const newBanner = async (req: Request, res: Response) => {
//     const payload: bannerDetailsDto = req.body;

//     try {
//         // Validate incoming data
//         const validation = bannerDetailsValidation.validate(payload);
//         if (validation?.error) {
//             throw new ValidationException(validation.error.message);
//         }

//         const bannerRepo = appSource.getRepository(banner);

//         if (payload.banner_id > 0) {
//             const existingBanner = await bannerRepo.findOneBy({ bannerid: payload.banner_id });

//             if (existingBanner) {
//                 const { banner_id, cuid, ...updatePayload } = payload;
//                 await bannerRepo.update({ bannerid: payload.banner_id }, updatePayload);

//                 return res.status(200).send({ IsSuccess: "Banner updated successfully" });
//             } else {
//                 return res.status(404).send({ message: "Banner not found" });
//             }

//         } else {
//             // const { banner_id, ...newBannerPayload } = payload;
//             // const newBanner = bannerRepo.create(newBannerPayload);
//             await bannerRepo.save(payload);

//             return res.status(200).send({ IsSuccess: "Banner added successfully" });
//         }
//     } catch (error) {
//         if (error instanceof ValidationException) {
//             return res.status(400).send({ message: error.message });
//         }
//         return res.status(500).send({ message: "Internal server error" });
//     }
// };

export const newBanner = async (req: Request, res: Response) => {
    const payload: bannerDetailsDto = req.body;
    try {
      const BrandRepository = appSource.getRepository(banner);
      if(payload.banner_id){
        console.log('came nto update')
        const validation = updateBannerValidation.validate(payload);
        if (validation?.error) {
          throw new ValidationException(validation.error.message);
        }
        const brandDetails  = await BrandRepository.findOneBy({
          bannerid : payload.banner_id
        });
        if(!brandDetails?.bannerid){
          throw new ValidationException("Brand not found");
        }
        const { cuid, banner_id, ...updatePayload } = payload;
        await BrandRepository.update({ bannerid: payload.banner_id }, updatePayload);
        res.status(200).send({
          IsSuccess: "Brand Details updated SuccessFully",
        });
        return;
      }
      const validation = bannerDetailsValidation.validate(payload);
      if (validation?.error) {
        throw new ValidationException(validation.error.message);
      }
      const { banner_id, ...updatePayload } = payload;
      await BrandRepository.save(updatePayload);
      res.status(200).send({
        IsSuccess: "Brand Details added SuccessFully",
      });
    } catch (error) {
      console.log(error , 'error')
      if (error instanceof ValidationException) {
        return res.status(400).send({
          message: error.message,
        });
      }
      res.status(500).send({ message: "Internal server error" });
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

export const deleteBanner = async (req: Request, res: Response) => {
    const id = req.params.banner_id;
    console.log("Received Brand ID:", id);
    const brandRepo = appSource.getRepository(banner);
    try {
        const typeNameFromDb = await  brandRepo
            .createQueryBuilder('BrandDetail')
            .where("BrandDetail.brandid = :brandid", {
                brandid: id,
            })
            .getOne();
        if (!typeNameFromDb?.bannerid) {
            throw new HttpException("brand not Found", 400);
        }
        await  brandRepo
            .createQueryBuilder("BrandDetail")
            .delete()
            .from(banner)
            .where("brandid = :brandid", { brandid: id })
            .execute();
        res.status(200).send({
            IsSuccess: `brand deleted successfully!`,
        });
    }
    catch (error) {
        if (error instanceof ValidationException) {
            return res.status(400).send({
                message: error?.message,
            });
        }
        res.status(500).send(error);
    }
  }

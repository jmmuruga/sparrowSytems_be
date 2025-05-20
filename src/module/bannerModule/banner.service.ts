import { Request, Response } from "express";
import {
  bannerDetailsDto,
  bannerDetailsValidation,
  bannerStatusDto,
  updateBannerValidation,
} from "./banner.dto";
import { HttpException, ValidationException } from "../../core/exception";
import { appSource } from "../../core/db";
import { banner } from "./banner.model";


export const newBanner = async (req: Request, res: Response) => {
  const payload: bannerDetailsDto = req.body;
  console.log(payload, "payload");
  try {
    const BannerRepository = appSource.getRepository(banner);
    if (payload.bannerid) {
      console.log("came nto update");
      const validation = updateBannerValidation.validate(payload);
      if (validation?.error) {
        throw new ValidationException(validation.error.message);
      }
      const bannerDetails = await BannerRepository.findOneBy({
        bannerid: payload.bannerid,
      });
      if (!bannerDetails?.bannerid) {
        throw new ValidationException("banner not found");
      }
      const { cuid, bannerid, ...updatePayload } = payload;
      await BannerRepository.update(
        { bannerid: payload.bannerid },
        updatePayload
      );
      res.status(200).send({
        IsSuccess: "banner Details updated SuccessFully",
      });
      return;
    }

    const existingProduct = await BannerRepository.findOneBy({
      title: payload.title,
    });
    if (existingProduct) {
      throw new ValidationException("Product name already exists");
    }

    const validation = bannerDetailsValidation.validate(payload);
    if (validation?.error) {
      throw new ValidationException(validation.error.message);
    }
    const { bannerid, ...updatePayload } = payload;
    await BannerRepository.save(updatePayload);
    res.status(200).send({
      IsSuccess: "banner Details added SuccessFully",
    });
  } catch (error) {
    console.log(error, "error");
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
    const bannerList = await Repository.createQueryBuilder().getMany();

    res.status(200).send({
      Result: bannerList,
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
  const id = req.params.bannerid;
  console.log("Received Banner ID:", id);
  const bannerRepo = appSource.getRepository(banner);
  try {
    const typeNameFromDb = await bannerRepo
      .createQueryBuilder("BannerDetail")
      .where("BannerDetail.bannerid = :bannerid", {
        bannerid: id,
      })
      .getOne();
    if (!typeNameFromDb?.bannerid) {
      throw new HttpException("banner not Found", 400);
    }
    await bannerRepo
      .createQueryBuilder("BannerDetail")
      .delete()
      .from(banner)
      .where("bannerid = :bannerid", { bannerid: id })
      .execute();
    res.status(200).send({
      IsSuccess: `banner deleted successfully!`,
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

// export const changeStatusBanner = async (req: Request, res: Response) => {
//   const status: bannerStatusDto = req.body;
//   const BannerRepository = appSource.getRepository(banner);
//   const details = await BannerRepository.findOneBy({
//     bannerid: Number(status.bannerid),
//   });
//   try {
//     if (!details) throw new HttpException("bannerDetails not Found", 400);
//     await BannerRepository.createQueryBuilder()
//       .update(banner)
//       .set({ status: status.status })
//       .where({ bannerid: Number(status.bannerid) })
//       .execute();
//     res.status(200).send({
//       IsSuccess: `Status for banner ${details.title} Updated successfully!`,
//     });
//   } catch (error) {
//     if (error instanceof ValidationException) {
//       return res.status(400).send({
//         message: error?.message,
//       });
//     }
//     res.status(500).send(error);
//   }
// };

export const changeStatusBanner = async (req: Request, res: Response) => {
  const { bannerid, status } = req.body;

  const BannerRepository = appSource.getRepository(banner);

  try {
    const bannerDetails = await BannerRepository.findOneBy({
      bannerid: Number(bannerid),
    });

    if (!bannerDetails) {
      return res.status(400).json({ message: "Banner not found" });
    }

    const isActive = status === 'true'; // ✅ Ensure boolean

    const updateResult = await BannerRepository.createQueryBuilder()
      .update(banner)
      .set({ status: isActive })
      .where("bannerid = :id", { id: Number(bannerid) })
      .execute();

    console.log("Update result:", updateResult); // ✅ Check affected rows

    if (updateResult.affected === 0) {
      return res.status(400).json({ message: "Update failed (no rows affected)" });
    }

    res.status(200).json({
      message: `Banner ${bannerDetails.title} updated to status ${isActive}`,
    });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};




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
  try {
    const BannerRepository = appSource.getRepository(banner);
    if (payload.bannerid) {
      // console.log(payload.status, typeof payload.status, 'status initially')
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

      // Safe conversion from "true"/"false"/true/false to boolean
      updatePayload.status = String(payload.status).toLowerCase() === "true";

      // console.log(payload.status, typeof payload.status, 'status initially');
      // console.log(updatePayload.status, typeof updatePayload.status, 'converted status');

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
    updatePayload.status = Boolean(updatePayload.status)
    await BannerRepository.save(updatePayload);
    res.status(200).send({
      IsSuccess: "banner Details added SuccessFully",
    });
  } catch (error) {
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

export const changeStatusBanner = async (req: Request, res: Response) => {
  const status: bannerStatusDto = req.body;
  const BannerRepository = appSource.getRepository(banner);

  const details = await BannerRepository.findOneBy({
    bannerid: Number(status.bannerid),
  });

  try {
    if (!details) throw new HttpException("banner not Found", 400);
    await BannerRepository.createQueryBuilder()
      .update(banner)
      .set({ status: status.status })
      .where({ bannerid: Number(status.bannerid) })
      .execute();
    res.status(200).send({
      IsSuccess: `Status for banner ${details.title} Updated successfully!`,
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
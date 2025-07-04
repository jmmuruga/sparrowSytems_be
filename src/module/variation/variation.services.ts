import { appSource } from "../../core/db";
import { HttpException, ValidationException } from "../../core/exception";
import { Request, Response } from "express";
import { variation } from "./variation.model";
import {
  changeVariationStatusDto,
  variationDto,
  variationUpdateValidate,
  variationValidate,
} from "./variation.dto";

export const addVariation = async (req: Request, res: Response) => {
  const payload: variation = req.body;
  try {
    const Repository = appSource.getRepository(variation);

    if (payload.id) {
      // ✅ Update specific variation row by id
      const validation = variationUpdateValidate.validate(payload);
      if (validation?.error) {
        throw new ValidationException(validation.error.message);
      }

      const { id, cuid, ...updatePayload } = payload;

      const existing = await Repository.findOneBy({ id });
      if (!existing) {
        return res
          .status(404)
          .send({ message: "Variation not found for update" });
      }

      await Repository.update({ id }, updatePayload);

      res.status(200).send({
        IsSuccess: "Variation updated successfully",
      });
      return;
    }

    // ✅ Insert new variation row
    const validation = variationValidate.validate(payload);
    if (validation?.error) {
      throw new ValidationException(validation.error.message);
    }

    const { id, ...insertPayload } = payload;

    await Repository.save(insertPayload);

    res.status(200).send({
      IsSuccess: "Variation added successfully",
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

export const generateVariationId = async (req: Request, res: Response) => {
  try {
    const variationRepoistry = appSource.getRepository(variation);
    const variationList = await variationRepoistry.query(
      `SELECT variationGroupId
            FROM [${process.env.DB_name}].[dbo].[variation]
            Group by  variationGroupId
            ORDER BY CAST( variationGroupId AS INT) DESC;`
    );
    let id = "0";
    if (variationList?.length > 0) {
      id = variationList[0].variationGroupId;
    }
    res.status(200).send({
      Result: +id + +1,
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

// export const getvariation = async (req: Request, res: Response) => {
//   try {
//     const Repository = appSource.getRepository(variation);

//     const Data = await Repository.createQueryBuilder().getMany();
//     res.status(200).send({
//       Result: Data,
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

export const getvariation = async (req: Request, res: Response) => {
  try {
    // const Repository = appSource.getRepository(variation);

    const variation: any[] = await appSource.query(`
     SELECT 
  variationGroupId,
  variationGroup,
  status,
  MAX(created_at) AS created_at,
  MAX(updated_at) AS updated_at
FROM [${process.env.DB_name}].[dbo].[variation]
GROUP BY 
  variationGroupId, variationGroup, status; `);
    res.status(200).send({
      Result: variation,
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

export const deleteVariationid = async (req: Request, res: Response) => {
  const id = req.params.id;
  const Repo = appSource.getRepository(variation);

  try {
    const deleteVariation = await Repo.createQueryBuilder("variation")
      .where("variation.variationGroupId = :id", {
        id: id,
      })
      .getOne();
    if (!deleteVariation) {
      throw new HttpException("id not Found", 400);
    }
    await Repo.createQueryBuilder("variation")
      .delete()
      .from(variation)
      .where("variationGroupId = :id", { id: id })
      .execute();
    res.status(200).send({
      IsSuccess: `id  deleted successfully!`,
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

export const variationStatus = async (req: Request, res: Response) => {
  const variationStatus: changeVariationStatusDto = req.body;
  const variationrepo = appSource.getRepository(variation);

  try {
    const typeNameFromDb = await variationrepo.findBy({
      variationGroupId : variationStatus.id?.toString(),
    });
    if (typeNameFromDb?.length == 0) {
      throw new HttpException("Data not Found", 404);
    }
    await variationrepo
      .createQueryBuilder()
      .update(variation)
      .set({ status: variationStatus.status })
      .where({  variationGroupId : variationStatus.id?.toString() })
      .execute();

    res.status(200).send({
      IsSuccess: `Status Updated successfully!`,
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

export const getVariationGroup = async (req: Request, res: Response) => {
  try {
    const orderRepository = appSource.getRepository(variation);
    const details: variationDto[] = await orderRepository.query(
      `SELECT
    variationid,
    MAX(id) AS id,
    MAX(variationGroup) AS variationGroup,
    MAX(name) AS name,
    MAX(itemId) AS itemId,
    MAX(CAST(status AS INT)) AS status,
    MAX(cuid) AS cuid,
    MAX(muid) AS muid,
    MAX(created_at) AS created_at,
    MAX(updated_at) AS updated_at
FROM [${process.env.DB_name}].[dbo].[variation]
GROUP BY variationid`
    );
    res.status(200).send({ Result: details });
  } catch (error) {
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error?.message,
      });
    }
    res.status(500).send(error);
  }
};
export const getVariationName = async (req: Request, res: Response) => {
  try {
    const orderRepository = appSource.getRepository(variation);
    const details: variationDto[] = await orderRepository.query(
      `SELECT TOP 1000
    p.productid,
    p.variation_group,
    v.id AS variation_id,
    v.name AS variation_name
FROM [${process.env.DB_name}].[dbo].[products] p
INNER JOIN [${process.env.DB_name}].[dbo].[variation] v
    ON p.variation_group = v.variationGroup`
    );
    res.status(200).send({ Result: details });
  } catch (error) {
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error?.message,
      });
    }
    res.status(500).send(error);
  }
};

export const getVariationDetails = async (req: Request, res: Response) => {
  const variationGroupId = req.params.variationGroupId;
  try {
    const VariationRepository = appSource.getRepository(variation);

    const Data = await VariationRepository.createQueryBuilder()
      .where({ variationGroupId: variationGroupId })
      .getMany();
    res.status(200).send({
      Result: Data,
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

export const updateVariation = async (req: Request, res: Response) => {
  const payload: variation[] = req.body;
  try {
    const variationRepoistry = appSource.getRepository(variation);
    const currentVariation = await variationRepoistry.findBy({
      variationGroupId: payload[0].variationGroupId,
    });
    if (!currentVariation) {
      throw new ValidationException("Unable to find variation.Cannot edit");
    }
    await variationRepoistry
    .createQueryBuilder()
    .delete()
    .from(variation)
    .where({variationGroupId :payload[0].variationGroupId })
    .execute()
 
    for (const item of payload) {
      const validation = variationUpdateValidate.validate(item);
      if (validation?.error) {
        throw new ValidationException(validation.error.message);
      }

      await variationRepoistry.save(item);
    }
   res.status(200).send({
      IsSuccess: "Variation Updated successfully",
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

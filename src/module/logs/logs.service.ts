import { appSource } from "../../core/db";
import { UserDetails } from "../userDetails/userDetails.model";
import { LogsDto } from "./logs.dto";
import { Logs } from "./logs.model";

export const InsertLog = async (payload: LogsDto): Promise<void> => {
  const logsRepository = appSource.getRepository(Logs);
  const userRepository = appSource.getRepository(UserDetails);

  const userDetail = await userRepository.findOneBy({ userid: payload.userId });
  const userName = userDetail?.username;
  payload.message = payload.message + " " + userName;
  payload.userName = userName || '';
  await logsRepository.save(payload);
};
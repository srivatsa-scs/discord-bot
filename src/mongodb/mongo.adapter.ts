import mongoose from "mongoose";
import * as config from "../../config/config.json";
import { fetchGw2AccName } from "../gw2api/find.account.name";
import UserModel from "./user.model";
import { logger } from "../logger/log4js.adapter";

let database: mongoose.Connection;

export async function connectDB() {
  mongoose.connect(config.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });

  database = mongoose.connection;

  database.on("connecting", () => {
    logger.debug(`Initiated connection to MongoDB`);
  });

  database.on("disconnecting", () => {
    logger.debug(`Initiated disconnection from MongoDB`);
  });

  database.on("connected", () => {
    logger.info(`MongoDB Connected`);
  });

  database.on("error", (err: any) => {
    logger.info("Error Connecting to Database");
    logger.error(err);
  });

  database.on("disconnected", () => {
    logger.info(`Mongoose lost connection to the database server`);
  });

  database.on("close", () => {
    logger.info(`MongoDB connection closed`);
  });

  database.on("reconnected", () => {
    logger.info(`MongoDB reconnected`);
  });

  database.on("reconnected", () => {
    logger.error(`MongoDB reconnect failed`);
  });
}

export async function disconnectDB() {
  if (!database) {
    return;
  }
  return mongoose.disconnect();
}

export function mongoDbHandler() {
  let user = new UserModel({
    discord: config.DISCORD_USER_ID,
    gw2ApiKey: [{ accName: config.GW2_ACC_NAME, apiKey: config.GW2_API_KEY }],
  });
  UserModel.findOne({ discord: config.DISCORD_USER_ID }, async (err: any, docs: any) => {
    if (err) logger.error(err);
    else {
      if (docs) {
        logger.info("User already exists");
      } else {
        // Validate if the key has all the required perms
        user.save((err: any, reg: any) => {
          if (err) {
            logger.error("Error when saving:" + err);
          } else {
            logger.info(`User saved with id ${reg.id}`);
          }
        });
      }
    }
  });
}

export async function findAllApiKeys(discordUserId: string): Promise<any> {
  try {
    const resp: any = await UserModel.findOne({
      discord: discordUserId,
    }).exec();
    if (resp) {
      return resp.gw2;
    } else return [];
  } catch (err) {
    logger.error(err);
    return { error: "An error occoured when checking the database." };
  }
}

export async function getAccInfo(apiKey: string, discordUserId: string): Promise<string> {
  try {
    const resp = await UserModel.findOne({ discord: discordUserId }, "gw2").exec();
    if (resp) {
      logger.info(resp);
    }
  } catch (err) {
    logger.error("Error occoured with Database");
  }
  return "";
}

export async function insertApiKey(apiKey: string, discordUserId: string): Promise<number> {
  try {
    const resp: any = await UserModel.findOne({ discord: discordUserId }, "gw2").exec();
    if (resp) {
      logger.debug("Discord user already exists");
      let accAlreadyExists: boolean = false;

      /* Check to see if the API key is present in the database */
      for (let element of resp.gw2) {
        if (element.apiKey === apiKey) {
          accAlreadyExists = true;
          break;
        }
      }
      if (!accAlreadyExists) {
        logger.debug("Account does not exist");
        const accName: string = await fetchGw2AccName(apiKey);
        if (accName === "") {
          return 5;
        } else {
          const dbResp = await UserModel.updateOne(
            { _id: resp._id },
            {
              $push: {
                gw2: { accName: accName, apiKey: apiKey },
              },
            }
          );
          if (dbResp.ok === 1) {
            logger.debug("New API Key has been added");
            return 0;
          } else return 5;
        }
      } else {
        logger.info("API key already exists");
        return 2;
      }
    } else {
      logger.info(`Discord user does not exist`);
      const accName: string = await fetchGw2AccName(apiKey);
      logger.info(accName);
      const newUser = new UserModel({
        discord: discordUserId,
        gw2: {
          accName: accName,
          apiKey: apiKey,
        },
      });
      const dbSaveResp = await newUser.save();
      return 0;
    }
  } catch (err) {
    return 5;
  }
}

export async function removeApiKey(_id: string, discordUserId: string): Promise<Boolean> {
  const user = await UserModel.findOne({ discord: discordUserId });
  let removalResponse: boolean = false;
  await UserModel.findOneAndUpdate({ _id: user!._id }, { $pull: { gw2: { _id: _id } } }, { new: true }, (err: any) => {
    if (err) {
      logger.error(err);
      removalResponse = false;
    } else {
      removalResponse = true;
    }
  });
  return removalResponse;
}

/* Return Codes */

// 0: New discord user created
// 1: New API key added
// 2: API key already exists
// 3: Issue with fetching name
// 4: Issue with database
// 5: Unknown error

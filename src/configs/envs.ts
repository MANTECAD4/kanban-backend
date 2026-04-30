import "dotenv/config";
import { get } from "env-var";

export const envs = () => ({
  PORT: get("PORT").required().asPortNumber(),
  POSTGRES_URL: get("POSTGRES_URL").required().asString(),
  TOKEN_SECRET: get("TOKEN_SECRET").required().asString(),
  ACCESS_TOKEN_DURATION: get("ACCESS_TOKEN_DURATION")
    .required()
    .asIntPositive(),
  REFRESH_TOKEN_DURATION: get("REFRESH_TOKEN_DURATION")
    .required()
    .asIntPositive(),
});

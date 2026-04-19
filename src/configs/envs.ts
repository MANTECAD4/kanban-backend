import "dotenv/config";
import { get } from "env-var";

export const envs = () => ({
  PORT: get("PORT").required().asPortNumber(),
  POSTGRES_URL: get("POSTGRES_URL").required().asString(),
  TOKEN_SEED: get("TOKEN_SEED").required().asString(),
});

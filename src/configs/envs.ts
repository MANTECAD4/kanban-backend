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

  SUPABASE_URL: get("SUPABASE_URL").required().asString(),
  SUPABASE_PUBLISHABLE_KEY: get("SUPABASE_PUBLISHABLE_KEY")
    .required()
    .asString(),
  SUPABASE_SECRET_KEY: get("SUPABASE_SECRET_KEY").required().asString(),
  SUPABASE_JWKS_URL: get("SUPABASE_JWKS_URL").required().asString(),
});

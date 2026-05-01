import { AccessTokenPayload } from "../application/dtos";

declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
      validatedBody?: Record<string, any>;
      validatedParams?: Record<string, any>;
      validatedQuery?: Record<string, any>;
    }
  }
}

import { TokenPayload } from "../application/dtos";

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
      validatedBody?: Record<string, any>;
      validatedParams?: Record<string, any>;
      validatedQuery?: Record<string, any>;
    }
  }
}

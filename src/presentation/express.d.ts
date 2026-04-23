import { TokenReturnDto } from "../application/dtos";

declare global {
  namespace Express {
    interface Request {
      user?: Record<string, unknown>;
      validatedUser?: Record<string, unknown>;
      validatedBody?: Record<string, unknown>;
      validatedParams?: Record<string, unknown>;
      validatedQuery?: Record<string, unknown>;
    }
  }
}

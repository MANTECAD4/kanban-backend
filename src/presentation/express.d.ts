import { TokenReturnDto } from "../application/dtos";

declare global {
  namespace Express {
    interface Request {
      user?: Record<string, any>;
      validatedUser?: Record<string, any>;
      validatedBody?: Record<string, any>;
      validatedParams?: Record<string, any>;
      validatedQuery?: Record<string, any>;
    }
  }
}

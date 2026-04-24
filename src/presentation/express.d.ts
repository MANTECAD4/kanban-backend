import { TokenReturnDto } from "../application/dtos";

declare global {
  namespace Express {
    interface Request {
      user?: TokenReturnDto;
      validatedBody?: Record<string, any>;
      validatedParams?: Record<string, any>;
      validatedQuery?: Record<string, any>;
    }
  }
}

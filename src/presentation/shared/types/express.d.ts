import { TokenReturnDto } from "../../../application/dtos";

declare global {
  namespace Express {
    interface Request {
      user?: TokenReturnDto;
    }
  }
}

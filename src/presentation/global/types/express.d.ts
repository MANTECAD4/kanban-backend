import { TokenPayload } from "../../../domain/services";

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

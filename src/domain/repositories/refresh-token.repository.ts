import { RefreshTokenEntityDto } from "../../application/dtos";
import { RefreshTokenEntity } from "../entities/refresh-token.entity";

export abstract class RefreshTokenRepository {
  abstract checkRelation: (
    userId: number,
    jti: string,
  ) => Promise<RefreshTokenEntity | null>;
  abstract save: (
    refreshTokenEntityDto: RefreshTokenEntityDto,
  ) => Promise<RefreshTokenEntity>;
  abstract getByJti: (jti: string) => Promise<RefreshTokenEntity | null>;
  abstract revoke: (jti: string) => Promise<RefreshTokenEntity>;
  abstract revokeAllByUser: (userId: number) => Promise<void>;
}

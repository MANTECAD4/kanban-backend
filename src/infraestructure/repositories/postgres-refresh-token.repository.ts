import { RefreshTokenEntityDto } from "../../application/dtos";
import { prisma } from "../../data/init-postgres";
import { RefreshTokenEntity } from "../../domain/entities/refresh-token.entity";
import { RefreshTokenRepository } from "../../domain/repositories";

export class PostgresRefreshTokenRepository implements RefreshTokenRepository {
  public checkRelation = async (
    userId: number,
    jti: string,
  ): Promise<RefreshTokenEntity | null> => {
    const refreshTokenRegister = await prisma.refreshToken.findUnique({
      where: { jti, user_id: userId },
    });
    return refreshTokenRegister
      ? RefreshTokenEntity.fromObject(refreshTokenRegister)
      : null;
  };

  public save = async ({
    jti,
    hash,
    expiresAt,
    userId,
  }: RefreshTokenEntityDto): Promise<RefreshTokenEntity> => {
    const refreshTokenRegister = await prisma.refreshToken.create({
      data: { jti, hash, expires_at: expiresAt, user_id: userId },
    });
    return RefreshTokenEntity.fromObject(refreshTokenRegister);
  };

  public getByJti = async (jti: string): Promise<RefreshTokenEntity | null> => {
    const refreshTokenRegister = await prisma.refreshToken.findUnique({
      where: { jti },
    });
    return refreshTokenRegister
      ? RefreshTokenEntity.fromObject(refreshTokenRegister)
      : null;
  };

  public revoke = async (jti: string): Promise<RefreshTokenEntity> => {
    const refreshTokenRegister = await prisma.refreshToken.update({
      where: { jti },
      data: { revoked: true },
    });
    return RefreshTokenEntity.fromObject(refreshTokenRegister);
  };
  public revokeAllByUser = async (userId: number): Promise<void> => {
    await prisma.refreshToken.updateMany({
      where: { user_id: userId },
      data: { revoked: true },
    });
  };
}

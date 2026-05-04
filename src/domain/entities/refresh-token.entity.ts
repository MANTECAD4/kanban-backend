interface ClassProperties {
  jti: string;
  hash: string;
  expiresAt: Date;
  revokedAt: Date | null;
  userId: number;
}

export class RefreshTokenEntity {
  public readonly jti: string;
  public readonly hash: string;
  public readonly expiresAt: Date;
  public readonly revokedAt: Date | null;
  public readonly userId: number;

  constructor(props: ClassProperties) {
    const { jti: jit, hash, expiresAt, revokedAt, userId } = props;
    this.jti = jit;
    this.hash = hash;
    this.expiresAt = expiresAt;
    this.revokedAt = revokedAt;
    this.userId = userId;
  }

  public static fromObject = (object: Record<string, any>) => {
    const { jti, hash, expiresAt, expires_at, revoked, userId, user_id } =
      object;

    return new RefreshTokenEntity({
      jti: jti,
      hash,
      expiresAt: expiresAt ?? expires_at,
      revokedAt: revoked,
      userId: userId ?? user_id,
    });
  };
}

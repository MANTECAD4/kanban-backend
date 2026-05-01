interface ClassProperties {
  jti: string;
  hash: string;
  expiresAt: Date;
  revoked: boolean;
  userId: number;
}

export class RefreshTokenEntity {
  public readonly jti: string;
  public readonly hash: string;
  public readonly expiresAt: Date;
  public readonly revoked: boolean;
  public readonly userId: number;

  constructor(props: ClassProperties) {
    const { jti: jit, hash, expiresAt, revoked, userId } = props;
    this.jti = jit;
    this.hash = hash;
    this.expiresAt = expiresAt;
    this.revoked = revoked;
    this.userId = userId;
  }

  public static fromObject = (object: Record<string, any>) => {
    const { jti, hash, expiresAt, expires_at, revoked, userId, user_id } =
      object;

    return new RefreshTokenEntity({
      jti: jti,
      hash,
      expiresAt: expiresAt ?? expires_at,
      revoked,
      userId: userId ?? user_id,
    });
  };
}

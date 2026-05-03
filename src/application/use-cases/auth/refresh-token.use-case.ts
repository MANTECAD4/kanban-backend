import { VerifyErrors } from "jsonwebtoken";
import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { RefreshTokenRepository } from "../../../domain/repositories";
import { HasherService, TokenProvider } from "../../../domain/services";
import { RefreshTokenPersistencyService } from "../../../domain/services/refresh-token-persistency.service";

interface ClassDependencies {
  tokenProvider: TokenProvider;
  hashService: HasherService;
  refreshTokenRepository: RefreshTokenRepository;
  refreshTokenPersistencyService: RefreshTokenPersistencyService;
  refreshTokenDuration: number;
  accessTokenDuration: number;
}

export class RefreshTokenUseCase {
  private readonly tokenProvider: TokenProvider;
  private readonly hashService: HasherService;
  private readonly refreshTokenRepository: RefreshTokenRepository;
  private readonly refreshTokenPersistencyService: RefreshTokenPersistencyService;
  private readonly refreshTokenDuration: number;
  private readonly accessTokenDuration: number;

  constructor(dependencies: ClassDependencies) {
    const {
      tokenProvider,
      refreshTokenRepository,
      refreshTokenDuration,
      refreshTokenPersistencyService,
      accessTokenDuration,
      hashService,
    } = dependencies;

    this.tokenProvider = tokenProvider;
    this.hashService = hashService;
    this.refreshTokenRepository = refreshTokenRepository;
    this.refreshTokenPersistencyService = refreshTokenPersistencyService;
    this.refreshTokenDuration = refreshTokenDuration;
    this.accessTokenDuration = accessTokenDuration;
  }

  public execute = async (refreshToken: string) => {
    if (!refreshToken) {
      throw CustomError.unauthorized("Missing token", ErrorCodes.UNAUTHORIZED);
    }
    try {
      const payload = this.tokenProvider.validate(refreshToken);
      if (!payload || payload.type !== "refresh")
        throw CustomError.unauthorized(
          "Invalid token 1",
          ErrorCodes.UNAUTHORIZED,
        );
      const {
        jti,
        sub: { id: userId },
      } = payload;
      const tokenInDb = await this.refreshTokenRepository.getByJti(jti);
      if (!tokenInDb)
        throw CustomError.notFound(
          "Token not found in DB",
          ErrorCodes.NOT_FOUND,
        );
      if (tokenInDb.revoked) {
        throw CustomError.unauthorized(
          "Token is no longer available to use. It is revoked",
          ErrorCodes.UNAUTHORIZED,
        );
      }

      if (new Date() > new Date(tokenInDb.expiresAt)) {
        throw CustomError.unauthorized(
          "Token expired",
          ErrorCodes.EXPIRED_TOKEN,
        );
      }
      const hashMatches = await this.hashService.compare(
        refreshToken,
        tokenInDb.hash,
      );
      if (!hashMatches) {
        throw CustomError.unauthorized(
          "Recieved token and the stored one doesn't match",
          ErrorCodes.UNAUTHORIZED,
        );
      }

      await this.refreshTokenRepository.revoke(jti);

      const newRefreshToken =
        await this.refreshTokenPersistencyService.createAndSave({
          userId,
          refreshTokenDuration: this.refreshTokenDuration,
        });

      const accessToken = this.tokenProvider.generate(
        { sub: { id: userId }, type: "access" },
        this.accessTokenDuration,
      );

      return { accessToken, newRefreshToken };
    } catch (error) {
      if (error instanceof CustomError) throw error;
      const { message } = error as VerifyErrors;
      let customErrorInstance;
      if (message.match(/expires/i)) {
        customErrorInstance = CustomError.unauthorized(
          "Token expired",
          ErrorCodes.EXPIRED_TOKEN,
        );
      } else {
        customErrorInstance = CustomError.unauthorized(
          "Invalid token",
          ErrorCodes.UNAUTHORIZED,
        );
      }
      throw customErrorInstance;
    }
  };
}

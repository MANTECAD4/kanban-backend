import { VerifyErrors } from "jsonwebtoken";
import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { HasherService, TokenProvider } from "../../../domain/services";
import { RefreshTokenRepository } from "../../../domain/repositories";

interface ClassDependencies {
  tokenProvider: TokenProvider;
  hashService: HasherService;
  refreshTokenRepository: RefreshTokenRepository;
}

export class LogoutUseCase {
  private readonly tokenProvider: TokenProvider;
  private readonly hashService: HasherService;
  private readonly refreshTokenRepository: RefreshTokenRepository;

  constructor(dependencies: ClassDependencies) {
    const { tokenProvider, refreshTokenRepository, hashService } = dependencies;
    this.tokenProvider = tokenProvider;
    this.hashService = hashService;
    this.refreshTokenRepository = refreshTokenRepository;
  }

  public execute = async (refreshToken: string) => {
    try {
      if (!refreshToken)
        throw CustomError.unauthorized(
          "Missing token",
          ErrorCodes.UNAUTHORIZED,
        );

      const payload = this.tokenProvider.validate(refreshToken);
      if (!payload)
        throw CustomError.unauthorized(
          "Invalid token. Payload not found",
          ErrorCodes.INVALID_TOKEN,
        );
      if (payload.type !== "refresh")
        throw CustomError.unauthorized(
          "Invalid token type",
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
      if (tokenInDb.revoked)
        throw CustomError.unauthorized(
          "Invalid token. It was already revoked",
          ErrorCodes.UNAUTHORIZED,
        );
      if (new Date() > new Date(tokenInDb.expiresAt))
        throw CustomError.unauthorized(
          "Expired token",
          ErrorCodes.EXPIRED_TOKEN,
        );

      const hashMatches = await this.hashService.compare(
        refreshToken,
        tokenInDb.hash,
      );
      if (!hashMatches)
        throw CustomError.unauthorized(
          `Provided token doesn't match with DB`,
          ErrorCodes.UNAUTHORIZED,
        );
      await this.refreshTokenRepository.revokeAllByUser(userId);
    } catch (error) {
      if (error instanceof CustomError) throw error;
      const { message } = error as VerifyErrors;
      let customErrorInstance;
      if (message.match(/expired/i))
        customErrorInstance = CustomError.unauthorized(
          "Token expired",
          ErrorCodes.EXPIRED_TOKEN,
        );
      else {
        customErrorInstance = CustomError.unauthorized(
          "Invalid token",
          ErrorCodes.UNAUTHORIZED,
        );
      }
      throw customErrorInstance;
    }
  };
}

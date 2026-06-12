import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { RefreshTokenRepository } from "../../../domain/repositories";
import { TokenProvider } from "../../../domain/services";
import { RefreshTokenPersistencyService } from "../../../domain/services/refresh-token-persistency.service";
import { RefreshTokenPayload } from "../../dtos";

interface ClassDependencies {
  tokenProvider: TokenProvider;
  refreshTokenRepository: RefreshTokenRepository;
  refreshTokenPersistencyService: RefreshTokenPersistencyService;
  refreshTokenDuration: number;
  accessTokenDuration: number;
}

export class RefreshTokenUseCase {
  private readonly tokenProvider: TokenProvider;
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
    } = dependencies;

    this.tokenProvider = tokenProvider;
    this.refreshTokenRepository = refreshTokenRepository;
    this.refreshTokenPersistencyService = refreshTokenPersistencyService;
    this.refreshTokenDuration = refreshTokenDuration;
    this.accessTokenDuration = accessTokenDuration;
  }

  public execute = async (user: RefreshTokenPayload) => {
    if (!user)
      throw CustomError.unauthorized({
        title: "Sign in",
        message: "Session not found",
        code: ErrorCodes.UNAUTHORIZED,
        details: null,
      });
    const {
      sub: { id: userId },
      jti,
    } = user;

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
  };
}

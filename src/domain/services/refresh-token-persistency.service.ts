import { RefreshTokenRepository } from "../repositories";
import { HasherService } from "./hasher.service";
import { TokenProvider } from "./token-generator.service";

interface ClassDependencies {
  refreshTokenRepository: RefreshTokenRepository;
  tokenProvider: TokenProvider;
  hasherService: HasherService;
}

interface SaveProps {
  userId: number;
  refreshTokenDuration: number;
}
export class RefreshTokenPersistencyService {
  private readonly refreshTokenRepository: RefreshTokenRepository;
  private readonly tokenProvider: TokenProvider;
  private readonly hasherService: HasherService;

  constructor(dependencies: ClassDependencies) {
    const { refreshTokenRepository, tokenProvider, hasherService } =
      dependencies;
    this.tokenProvider = tokenProvider;
    this.refreshTokenRepository = refreshTokenRepository;
    this.hasherService = hasherService;
  }

  public createAndSave = async ({
    userId,
    refreshTokenDuration,
  }: SaveProps): Promise<string> => {
    const jti = crypto.randomUUID();
    const refreshToken = this.tokenProvider.generate(
      { sub: { id: userId }, type: "refresh", jti },
      refreshTokenDuration,
    );

    const hashedToken = await this.hasherService.hash(refreshToken);
    const tokenExpiresAt = new Date(
      Date.now() + refreshTokenDuration * 60 * 1000,
    );
    await this.refreshTokenRepository.save({
      jti,
      hash: hashedToken,
      userId,
      expiresAt: tokenExpiresAt,
    });
    return refreshToken;
  };
}

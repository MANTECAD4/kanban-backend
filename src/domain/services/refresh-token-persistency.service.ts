import { RefreshTokenRepository } from "../repositories";
import { HasherService } from "./hasher.service";

interface ClassDependencies {
  refreshTokenRepository: RefreshTokenRepository;
  hasherService: HasherService;
}

interface SaveProps {
  userId: number;
  jti: string;
  token: string;
  refreshTokenDuration: number;
}
export class RefreshTokenPersistencyService {
  private readonly refreshTokenRepository: RefreshTokenRepository;
  private readonly hasherService: HasherService;

  constructor(dependencies: ClassDependencies) {
    const { refreshTokenRepository: refreshToeknRepository, hasherService } =
      dependencies;
    this.refreshTokenRepository = refreshToeknRepository;
    this.hasherService = hasherService;
  }

  public save = async ({
    userId,
    jti,
    token,
    refreshTokenDuration,
  }: SaveProps) => {
    const hashedToken = await this.hasherService.hash(token);
    const tokenExpiresAt = new Date(
      Date.now() + refreshTokenDuration * 60 * 1000,
    );
    await this.refreshTokenRepository.save({
      jti,
      hash: hashedToken,
      userId,
      expiresAt: tokenExpiresAt,
    });
  };
}

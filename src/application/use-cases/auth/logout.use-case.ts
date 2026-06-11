import { RefreshTokenRepository } from "../../../domain/repositories";
import { RefreshTokenPayload } from "../../dtos";

interface ClassDependencies {
  refreshTokenRepository: RefreshTokenRepository;
}

export class LogoutUseCase {
  private readonly refreshTokenRepository: RefreshTokenRepository;

  constructor(dependencies: ClassDependencies) {
    const { refreshTokenRepository } = dependencies;

    this.refreshTokenRepository = refreshTokenRepository;
  }

  public execute = async (user: RefreshTokenPayload) => {
    const {
      sub: { id: userId },
    } = user;
    await this.refreshTokenRepository.revokeAllByUser(userId);
  };
}

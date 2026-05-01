import { envs } from "../../../configs/envs";
import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { AuthRepository } from "../../../domain/repositories";
import { HasherService } from "../../../domain/services/hasher.service";
import { TokenProvider } from "../../../domain/services/token-generator.service";
import { LoginUserDto } from "../../dtos";

interface ClassDependencies {
  authRepository: AuthRepository;
  tokenProvider: TokenProvider;
  softHasher: HasherService;
  strongHasher: HasherService;
  acccesTokenDuration: number;
  refreshTokenDuration: number;
}

export class LoginUserUseCase {
  private readonly authRepository: AuthRepository;
  private readonly tokenProvider: TokenProvider;
  private readonly softHasher: HasherService;
  private readonly strongHasher: HasherService;
  private readonly acccesTokenDuration: number;
  private readonly refreshTokenDuration: number;
  constructor(dependencies: ClassDependencies) {
    const {
      authRepository,
      tokenProvider,
      softHasher,
      strongHasher,
      acccesTokenDuration,
      refreshTokenDuration,
    } = dependencies;
    this.authRepository = authRepository;
    this.tokenProvider = tokenProvider;
    this.softHasher = softHasher;
    this.strongHasher = strongHasher;
    this.acccesTokenDuration = acccesTokenDuration;
    this.refreshTokenDuration = refreshTokenDuration;
  }

  public execute = async (data: LoginUserDto) => {
    const { email, password: rawPassword } = data;

    const existentUser = await this.authRepository.getByEmail(email);
    if (!existentUser)
      throw CustomError.notFound("Email not registered", ErrorCodes.NOT_FOUND);

    const passwordMatches = this.strongHasher.compare(
      rawPassword,
      existentUser.password,
    );
    if (!passwordMatches)
      throw CustomError.unauthorized("Invalid login", ErrorCodes.UNAUTHORIZED);

    const { password, ...rest } = existentUser;
    const accessToken = this.tokenProvider.generate(
      { sub: { id: rest.id }, type: "access" },
      this.acccesTokenDuration,
    );

    const jti = crypto.randomUUID();
    const refreshToken = this.tokenProvider.generate(
      { sub: { id: rest.id }, type: "refresh", jti },
      this.refreshTokenDuration,
    );
    return {
      data: { user: rest, accessToken, refreshToken },
    };
  };
}
//

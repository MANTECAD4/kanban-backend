import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { AuthRepository } from "../../../domain/repositories";
import { HasherService } from "../../../domain/services/hasher.service";
import { TokenProvider } from "../../../domain/services/token-generator.service";
import { LoginUserDto } from "../../dtos";
import { RefreshTokenPersistencyService } from "../../../domain/services/refresh-token-persistency.service";

interface ClassDependencies {
  authRepository: AuthRepository;
  tokenProvider: TokenProvider;
  strongHasher: HasherService;
  accessTokenDuration: number;
  refreshTokenDuration: number;
  refreshTokenPersistencyService: RefreshTokenPersistencyService;
}

export class LoginUserUseCase {
  private readonly authRepository: AuthRepository;
  private readonly tokenProvider: TokenProvider;
  private readonly strongHasher: HasherService;
  private readonly accessTokenDuration: number;
  private readonly refreshTokenDuration: number;
  private readonly refreshTokenPersistencyService: RefreshTokenPersistencyService;
  constructor(dependencies: ClassDependencies) {
    const {
      authRepository,
      tokenProvider,
      strongHasher,
      accessTokenDuration,
      refreshTokenDuration,
      refreshTokenPersistencyService,
    } = dependencies;

    this.authRepository = authRepository;
    this.tokenProvider = tokenProvider;
    this.strongHasher = strongHasher;
    this.accessTokenDuration = accessTokenDuration;
    this.refreshTokenDuration = refreshTokenDuration;
    this.refreshTokenPersistencyService = refreshTokenPersistencyService;
  }

  public execute = async (data: LoginUserDto) => {
    const { email, password: rawPassword } = data;

    const existentUser = await this.authRepository.getByEmail(email);
    if (!existentUser)
      throw CustomError.notFound("Email not registered", ErrorCodes.NOT_FOUND);

    const passwordMatches = await this.strongHasher.compare(
      rawPassword,
      existentUser.password,
    );
    if (!passwordMatches)
      throw CustomError.unauthorized("Invalid login", ErrorCodes.UNAUTHORIZED);

    const { password, ...rest } = existentUser;
    const accessToken = this.tokenProvider.generate(
      { sub: { id: rest.id }, type: "access" },
      this.accessTokenDuration,
    );

    //! STORE NEW REFRESH TOKEN
    const jti = crypto.randomUUID();
    const refreshToken = this.tokenProvider.generate(
      { sub: { id: rest.id }, type: "refresh", jti },
      this.refreshTokenDuration,
    );

    await this.refreshTokenPersistencyService.save({
      jti,
      token: refreshToken,
      userId: rest.id,
      refreshTokenDuration: this.refreshTokenDuration,
    });

    return {
      data: { user: rest, accessToken },
      refreshToken,
    };
  };
}
//

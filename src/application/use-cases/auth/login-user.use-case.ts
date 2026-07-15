import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { UserRepository } from "../../../domain/repositories";
import { HasherService } from "../../../domain/services/hasher.service";
import { TokenProvider } from "../../../domain/services/token-generator.service";
import { LoginUserDto } from "../../dtos";
import { RefreshTokenPersistencyService } from "../../../domain/services/refresh-token-persistency.service";

interface ClassDependencies {
  userRepository: UserRepository;
  tokenProvider: TokenProvider;
  strongHasher: HasherService;
  accessTokenDuration: number;
  refreshTokenDuration: number;
  refreshTokenPersistencyService: RefreshTokenPersistencyService;
}

export class LoginUseCase {
  private readonly refreshTokenPersistencyService: RefreshTokenPersistencyService;
  private readonly userRepository: UserRepository;
  private readonly tokenProvider: TokenProvider;
  private readonly strongHasher: HasherService;
  private readonly accessTokenDuration: number;
  private readonly refreshTokenDuration: number;
  constructor(dependencies: ClassDependencies) {
    const {
      userRepository,
      tokenProvider,
      strongHasher,
      accessTokenDuration,
      refreshTokenDuration,
      refreshTokenPersistencyService,
    } = dependencies;

    this.userRepository = userRepository;
    this.tokenProvider = tokenProvider;
    this.strongHasher = strongHasher;
    this.accessTokenDuration = accessTokenDuration;
    this.refreshTokenDuration = refreshTokenDuration;
    this.refreshTokenPersistencyService = refreshTokenPersistencyService;
  }

  public execute = async (data: LoginUserDto) => {
    const { email, password: rawPassword } = data;

    const existentUser = await this.userRepository.getByEmail(email);
    if (!existentUser)
      throw CustomError.notFound({
        title: "Login failed",
        message: "Email not found",
        code: ErrorCodes.NOT_FOUND,
        details: null,
      });

    const passwordMatches = await this.strongHasher.compare(
      rawPassword,
      existentUser.password,
    );

    if (!passwordMatches)
      throw CustomError.unauthorized({
        title: "Login failed",
        message: "Invalid password",
        code: ErrorCodes.UNAUTHORIZED,
        details: null,
      });

    const { password, ...rest } = existentUser;
    const accessToken = this.tokenProvider.generate(
      { sub: { id: rest.id }, type: "access" },
      this.accessTokenDuration,
    );

    const refreshToken =
      await this.refreshTokenPersistencyService.createAndSave({
        userId: rest.id,
        refreshTokenDuration: this.refreshTokenDuration,
      });

    return {
      data: { user: rest },
      accessToken,
      refreshToken,
    };
  };
}
//

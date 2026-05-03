import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { AuthRepository } from "../../../domain/repositories";
import { TokenProvider } from "../../../domain/services";
import { HasherService } from "../../../domain/services/hasher.service";
import { RegisterUserDto } from "../../dtos";
import { RefreshTokenPersistencyService } from "../../../domain/services/refresh-token-persistency.service";

interface ClassDependencies {
  authRepository: AuthRepository;
  tokenProvider: TokenProvider;
  strongHasher: HasherService;
  accessTokenDuration: number;
  refreshTokenDuration: number;
  refreshTokenPersistencyService: RefreshTokenPersistencyService;
}

export class RegisterUserUseCase {
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

  public async execute(data: RegisterUserDto) {
    const { email, password: rawPassword, name } = data;

    const existentUser = await this.authRepository.getByEmail(email);

    if (existentUser)
      throw CustomError.badRequest(
        "Email already registered",
        ErrorCodes["ALREADY_REGISTERED"],
      );

    const hashedPassword = await this.strongHasher.hash(rawPassword);

    const { password, ...rest } = await this.authRepository.register({
      email,
      password: hashedPassword,
      name,
    });

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
  }
}

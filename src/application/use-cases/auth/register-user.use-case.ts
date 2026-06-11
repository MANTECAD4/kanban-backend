import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { UserRepository } from "../../../domain/repositories";
import { TokenProvider } from "../../../domain/services";
import { HasherService } from "../../../domain/services/hasher.service";
import { RegisterUserDto } from "../../dtos";
import { RefreshTokenPersistencyService } from "../../../domain/services/refresh-token-persistency.service";

interface ClassDependencies {
  userRepository: UserRepository;
  tokenProvider: TokenProvider;
  strongHasher: HasherService;
  accessTokenDuration: number;
  refreshTokenDuration: number;
  refreshTokenPersistencyService: RefreshTokenPersistencyService;
}

export class RegisterUserUseCase {
  private readonly userRepository: UserRepository;
  private readonly tokenProvider: TokenProvider;
  private readonly strongHasher: HasherService;
  private readonly accessTokenDuration: number;
  private readonly refreshTokenDuration: number;
  private readonly refreshTokenPersistencyService: RefreshTokenPersistencyService;
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

  public async execute(data: RegisterUserDto) {
    const { email, password: rawPassword, name } = data;

    const existentUser = await this.userRepository.getByEmail(email);

    if (existentUser)
      throw CustomError.badRequest({
        title: "Register failed",
        message: "Email already registered",
        code: ErrorCodes["ALREADY_REGISTERED"],
        details: null,
      });

    const hashedPassword = await this.strongHasher.hash(rawPassword);

    const { password, ...rest } = await this.userRepository.register({
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

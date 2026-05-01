import { envs } from "../../../configs/envs";
import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { AuthRepository } from "../../../domain/repositories";
import { TokenProvider } from "../../../domain/services";
import { HasherService } from "../../../domain/services/hasher.service";
import { RegisterUserDto } from "../../dtos";

interface ClassDependencies {
  authRepository: AuthRepository;
  tokenProvider: TokenProvider;
  strongHasher: HasherService;
}

export class RegisterUserUseCase {
  private readonly authRepository: AuthRepository;
  private readonly tokenProvider: TokenProvider;
  private readonly strongHasher: HasherService;
  constructor(dependencies: ClassDependencies) {
    const { authRepository, tokenProvider, strongHasher } = dependencies;

    this.authRepository = authRepository;
    this.tokenProvider = tokenProvider;
    this.strongHasher = strongHasher;
  }

  public async execute(data: RegisterUserDto) {
    const { ACCESS_TOKEN_DURATION } = envs();
    const { email, password: rawPassword, name } = data;

    const existentUser = await this.authRepository.getByEmail(email);

    if (existentUser)
      throw CustomError.badRequest(
        "Email already registered",
        ErrorCodes["ALREADY_REGISTERED"],
      );

    const hashedPassword = this.strongHasher.hash(rawPassword);

    const { password, ...rest } = await this.authRepository.register({
      email,
      password: hashedPassword,
      name,
    });

    const token = this.tokenProvider.generate(
      { sub: { id: rest.id }, type: "access" },
      ACCESS_TOKEN_DURATION,
    );
    return {
      data: { user: rest, token },
    };
  }
}

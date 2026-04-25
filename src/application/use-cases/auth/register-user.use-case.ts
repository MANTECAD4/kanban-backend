import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { AuthRepository } from "../../../domain/repositories";
import { TokenGenerator } from "../../../domain/services";
import { HasherService } from "../../../domain/services/hasher.service";
import { RegisterUserDto } from "../../dtos";

export class RegisterUserUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly tokenGenerator: TokenGenerator,
    private readonly hasherService: HasherService,
  ) {}

  public async execute(data: RegisterUserDto) {
    const { email, password: rawPassword, name } = data;

    const existentUser = await this.authRepository.getByEmail(email);

    if (existentUser)
      throw CustomError.badRequest(
        "Email already registered",
        ErrorCodes["ALREADY_REGISTERED"],
      );

    const hashedPassword = this.hasherService.hash(rawPassword);

    const { password, ...rest } = await this.authRepository.register({
      email,
      password: hashedPassword,
      name,
    });

    const token = await this.tokenGenerator.generate({ sub: { id: rest.id } });
    return {
      data: { user: rest, token, message: "User registered succesfully" },
    };
  }
}

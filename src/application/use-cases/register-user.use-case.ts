import { CustomError } from "../../domain/errors/custom-error";
import { AuthRepository } from "../../domain/repositories";
import { TokenGenerator } from "../../domain/services";

export class RegisterUserUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly tokenGenerator: TokenGenerator,
  ) {}

  public async execute(body: Record<string, any>) {
    const { email, password: rawPassword, name } = body;

    const existentUser = await this.authRepository.getByEmail(email);

    if (existentUser) throw CustomError.badRequest("Email already registered");

    const { password, ...rest } = await this.authRepository.register({
      email,
      password: rawPassword,
      name,
    });

    const token = await this.tokenGenerator.generate({ sub: rest.id }, 5);
    return {
      user: rest,
      token,
    };
  }
}

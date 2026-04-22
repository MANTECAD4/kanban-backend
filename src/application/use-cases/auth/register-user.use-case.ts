import { CustomError } from "../../../domain/errors/custom-error";
import { AuthRepository } from "../../../domain/repositories";
import { TokenGenerator } from "../../../domain/services";
import { HasherService } from "../../../domain/services/hasher.service";

export class RegisterUserUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly tokenGenerator: TokenGenerator,
    private readonly hasherService: HasherService,
  ) {}

  public async execute(body: Record<string, any>) {
    const { email, password: rawPassword, name } = body;

    const existentUser = await this.authRepository.getByEmail(email);

    if (existentUser) throw CustomError.badRequest("Email already registered");

    const hashedPassword = this.hasherService.hash(rawPassword);

    const { password, ...rest } = await this.authRepository.register({
      email,
      password: hashedPassword,
      name,
    });

    const token = await this.tokenGenerator.generate({ sub: { id: rest.id } });
    return {
      user: rest,
      token,
    };
  }
}

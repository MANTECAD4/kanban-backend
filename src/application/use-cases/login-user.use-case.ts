import { CustomError } from "../../domain/errors/custom-error";
import { AuthRepository } from "../../domain/repositories";
import { HasherService } from "../../domain/services/hasher.service";
import { TokenGenerator } from "../../domain/services/token-generator.service";

export class LoginUserUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly tokenService: TokenGenerator,
    private readonly hasherService: HasherService,
  ) {}

  public execute = async (body: Record<string, any>) => {
    const { email, password: rawPassword } = body;

    const existentUser = await this.authRepository.getByEmail(email);
    if (!existentUser) throw CustomError.forbidden("Invalid login");

    const passwordMatches = this.hasherService.compare(
      rawPassword,
      existentUser.password,
    );
    if (!passwordMatches) throw CustomError.forbidden("Invalid login");

    const { password, ...rest } = existentUser;
    const token = await this.tokenService.generate({ sub: rest.id });
    return {
      user: rest,
      token,
    };
  };
}

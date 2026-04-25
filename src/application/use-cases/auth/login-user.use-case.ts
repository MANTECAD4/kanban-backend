import { CustomError } from "../../../domain/errors/custom-error";
import { AuthRepository } from "../../../domain/repositories";
import { HasherService } from "../../../domain/services/hasher.service";
import { TokenGenerator } from "../../../domain/services/token-generator.service";
import { LoginUserDto } from "../../dtos";

export class LoginUserUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly tokenService: TokenGenerator,
    private readonly hasherService: HasherService,
  ) {}

  public execute = async (data: LoginUserDto) => {
    const { email, password: rawPassword } = data;

    const existentUser = await this.authRepository.getByEmail(email);
    if (!existentUser) throw CustomError.forbidden("Invalid login");

    const passwordMatches = this.hasherService.compare(
      rawPassword,
      existentUser.password,
    );
    if (!passwordMatches) throw CustomError.forbidden("Invalid login");

    const { password, ...rest } = existentUser;
    const token = await this.tokenService.generate({ sub: { id: rest.id } });
    // const decoded = await this.tokenService.validate(token);
    return {
      data: { user: rest, token },
      message: "Login succesful!",
    };
  };
}
//

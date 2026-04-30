import { envs } from "../../../configs/envs";
import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { AuthRepository } from "../../../domain/repositories";
import { HasherService } from "../../../domain/services/hasher.service";
import { TokenProvider } from "../../../domain/services/token-generator.service";
import { LoginUserDto } from "../../dtos";

export class LoginUserUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly tokenService: TokenProvider,
    private readonly hasherService: HasherService,
  ) {}

  public execute = async (data: LoginUserDto) => {
    const { ACCESS_TOKEN_DURATION, REFRESH_TOKEN_DURATION } = envs();
    const { email, password: rawPassword } = data;

    const existentUser = await this.authRepository.getByEmail(email);
    if (!existentUser)
      throw CustomError.notFound("Email not registered", ErrorCodes.NOT_FOUND);

    const passwordMatches = this.hasherService.compare(
      rawPassword,
      existentUser.password,
    );
    if (!passwordMatches)
      throw CustomError.unauthorized("Invalid login", ErrorCodes.UNAUTHORIZED);

    const { password, ...rest } = existentUser;
    const accessToken = this.tokenService.generate(
      { sub: { id: rest.id }, type: "access" },
      ACCESS_TOKEN_DURATION,
    );
    const refreshToken = this.tokenService.generate(
      { sub: { id: rest.id }, type: "refresh" },
      REFRESH_TOKEN_DURATION,
    );
    return {
      data: { user: rest, accessToken, refreshToken },
    };
  };
}
//

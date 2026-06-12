import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { UserRepository } from "../../../domain/repositories";
import { TokenProvider } from "../../../domain/services";

interface Dependencies {
  userRepository: UserRepository;
  tokenProvider: TokenProvider;
  accessTokenDuration: number;
}

export class GetUserInfoUseCase {
  private readonly userRepository: UserRepository;
  private readonly tokenProvider: TokenProvider;
  private readonly accessTokenDuration: number;
  constructor(dependencies: Dependencies) {
    const { userRepository, tokenProvider, accessTokenDuration } = dependencies;
    this.userRepository = userRepository;
    this.tokenProvider = tokenProvider;
    this.accessTokenDuration = accessTokenDuration;
  }
  public execute = async (userId: number) => {
    if (typeof userId !== "number") {
      throw CustomError.badRequest({
        title: `User's info query failed`,
        message: "Invalid user id recieved",
        code: ErrorCodes.BAD_REQUEST,
        details: null,
      });
    }

    const userFound = await this.userRepository.getById(userId);
    if (!userFound) {
      throw CustomError.badRequest({
        title: `User's info query failed`,
        message: "User not found",
        code: ErrorCodes.NOT_FOUND,
        details: null,
      });
    }

    const accessToken = this.tokenProvider.generate(
      { sub: { id: userFound.id }, type: "access" },
      this.accessTokenDuration,
    );

    const { password, ...rest } = userFound;
    return { data: { user: rest }, accessToken };
  };
}

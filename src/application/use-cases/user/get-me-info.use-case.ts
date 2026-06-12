import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { UserRepository } from "../../../domain/repositories";

interface Dependencies {
  userRepository: UserRepository;
}

export class GetUserInfoUseCase {
  private readonly userRepository: UserRepository;
  constructor(dependencies: Dependencies) {
    const { userRepository } = dependencies;
    this.userRepository = userRepository;
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

    const { password, ...rest } = userFound;
    return { data: rest };
  };
}

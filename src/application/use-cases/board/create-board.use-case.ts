import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { AuthRepository, BoardRepository } from "../../../domain/repositories";
import { CreateBoardDto, AccessTokenReturnDto } from "../../dtos";

export class CreateBoardUseCase {
  constructor(
    private readonly boardRepository: BoardRepository,
    private readonly authRepository: AuthRepository,
  ) {}

  public execute = async (user: AccessTokenReturnDto, data: CreateBoardDto) => {
    const existingUser = await this.authRepository.getById(user.sub.id);
    if (!existingUser)
      throw CustomError.notFound(
        `User with id ${user.sub.id} not found`,
        ErrorCodes.NOT_FOUND,
      );

    const existingBoardInUserCollection =
      await this.boardRepository.getByUserAndBoardName(user.sub.id, data.name);
    if (existingBoardInUserCollection)
      throw CustomError.badRequest(
        "Name already registered in user's collection",
        ErrorCodes.ALREADY_REGISTERED,
      );
    const createdBoard = await this.boardRepository.create(user.sub.id, data);
    return {
      data: createdBoard,
    };
  };
}

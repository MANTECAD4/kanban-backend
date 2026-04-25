import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { AuthRepository, BoardRepository } from "../../../domain/repositories";
import { CreateBoardDto, TokenReturnDto } from "../../dtos";

export class CreateBoardUseCase {
  constructor(
    private readonly boardRepository: BoardRepository,
    private readonly authRepository: AuthRepository,
  ) {}

  public execute = async (user: TokenReturnDto, data: CreateBoardDto) => {
    const existingUser = await this.authRepository.getById(user.sub.id);
    if (!existingUser)
      throw CustomError.unauthorized(
        `User with id ${user.sub.id} not found`,
        ErrorCodes.UNAUTHORIZED,
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
      message: "Board created succesfully",
    };
  };
}

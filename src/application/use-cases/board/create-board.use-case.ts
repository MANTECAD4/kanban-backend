import { CustomError } from "../../../domain/errors/custom-error";
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
      throw CustomError.internalServer(
        `User with id ${user.sub.id} not found. Should exist`,
      );

    const existingBoardInUserCollection =
      await this.boardRepository.getByUserAndBoardName(user.sub.id, data.name);
    if (existingBoardInUserCollection)
      throw CustomError.badRequest(
        "Name already registered in user's collection",
      );
    const createdBoard = await this.boardRepository.create(user.sub.id, data);
    return {
      board: createdBoard,
    };
  };
}

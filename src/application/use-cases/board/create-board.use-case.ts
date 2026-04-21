import { CustomError } from "../../../domain/errors/custom-error";
import { AuthRepository, BoardRepository } from "../../../domain/repositories";
import { CreateBoardDto } from "../../dtos";

export class CreateBoardUseCase {
  constructor(
    private readonly boardRepository: BoardRepository,
    private readonly authRepository: AuthRepository,
  ) {}

  public execute = async (body: CreateBoardDto) => {
    // const existingBoard = await this.boardRepository.findByName(body.name);
    // if (existingBoard)
    //   throw CustomError.badRequest("Board name already registered.");
    const existingUser = await this.authRepository.getById(Number(body.userId));
    if (!existingUser)
      throw CustomError.internalServer(
        `User with id ${body.userId} not found.`,
      );
    const createdBoard = await this.boardRepository.create(body);
    return {
      board: createdBoard,
    };
  };
}

import { CustomError } from "../../../domain/errors/custom-error";
import { AuthRepository, BoardRepository } from "../../../domain/repositories";
import { CreateBoardDto, TokenReturnDto } from "../../dtos";

export class CreateBoardUseCase {
  constructor(
    private readonly boardRepository: BoardRepository,
    private readonly authRepository: AuthRepository,
  ) {}

  public execute = async (
    user: Record<string, unknown>,
    body: CreateBoardDto,
  ) => {
    // const existingBoard = await this.boardRepository.findByName(body.name);
    // if (existingBoard)
    //   throw CustomError.badRequest("Board name already registered.");
    const existingUser = await this.authRepository.getById(
      (user as TokenReturnDto).sub.id,
    );
    if (!existingUser)
      throw CustomError.internalServer(
        `User with id ${(user as TokenReturnDto).sub.id} not found.`,
      );
    const createdBoard = await this.boardRepository.create(
      (user as TokenReturnDto).sub.id,
      body,
    );
    return {
      board: createdBoard,
    };
  };
}

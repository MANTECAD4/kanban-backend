import { CustomError } from "../../../domain/errors/custom-error";
import { AuthRepository, BoardRepository } from "../../../domain/repositories";

export class GetBoardsUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly boardRepository: BoardRepository,
  ) {}

  public execute = async (body: Record<string, any>) => {
    const { userId } = body;
    const existingUser = await this.authRepository.getById(userId);
    if (!existingUser)
      throw CustomError.internalServer(`User with id ${userId} not found.`);
    const boards = await this.boardRepository.findAll(userId);
    return {
      total: boards.length,
      boards,
    };
  };
}

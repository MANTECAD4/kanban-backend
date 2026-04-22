import { CustomError } from "../../../domain/errors/custom-error";
import { AuthRepository, BoardRepository } from "../../../domain/repositories";
import { TokenReturnDto } from "../../dtos";

export class GetBoardsUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly boardRepository: BoardRepository,
  ) {}

  public execute = async (user: TokenReturnDto) => {
    const {
      sub: { id },
    } = user;
    const existingUser = await this.authRepository.getById(id);
    if (!existingUser)
      throw CustomError.internalServer(`User with id ${id} not found.`);
    const boards = await this.boardRepository.findAll(id);
    return {
      total: boards.length,
      boards,
    };
  };
}

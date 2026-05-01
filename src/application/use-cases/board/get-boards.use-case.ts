import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { AuthRepository, BoardRepository } from "../../../domain/repositories";
import { AccessTokenReturnDto } from "../../dtos";

export class GetBoardsUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly boardRepository: BoardRepository,
  ) {}

  public execute = async (user: AccessTokenReturnDto) => {
    const {
      sub: { id },
    } = user;
    const existingUser = await this.authRepository.getById(id);
    if (!existingUser)
      throw CustomError.unauthorized(
        `User with id ${id} not found`,
        ErrorCodes.UNAUTHORIZED,
      );
    const boards = await this.boardRepository.getAll(id);
    return {
      data: boards,

      meta: { total: boards.length },
    };
  };
}

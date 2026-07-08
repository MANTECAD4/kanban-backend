import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { BoardRepository } from "../../../domain/repositories";

interface Dependencies {
  boardRepository: BoardRepository;
}

export class GetBoardBySlugUseCase {
  private readonly boardRepository: BoardRepository;
  constructor(dependencies: Dependencies) {
    const { boardRepository } = dependencies;
    this.boardRepository = boardRepository;
  }

  public execute = async (userId: number, boardSlug: string) => {
    console.log({ userId, boardSlug });
    const board = await this.boardRepository.checkRelation(userId, boardSlug);
    if (!board)
      throw CustomError.notFound({
        title: "Not found",
        message: `Board with slug ${boardSlug} not found`,
        code: ErrorCodes.NOT_FOUND,
        details: null,
      });
    return { board };
  };
}

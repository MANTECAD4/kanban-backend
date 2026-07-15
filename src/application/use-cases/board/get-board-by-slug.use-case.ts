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

  public execute = async (projectId: number, boardSlug: string) => {
    const board = await this.boardRepository.checkCollection(
      projectId,
      boardSlug,
    );
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

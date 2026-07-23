import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { BoardRepository } from "../../../domain/repositories";

interface ClassDependencies {
  boardRepository: BoardRepository;
}

export class GetBoardsUseCase {
  private readonly boardRepository: BoardRepository;
  constructor(dependencies: ClassDependencies) {
    const { boardRepository } = dependencies;
    this.boardRepository = boardRepository;
  }

  public execute = async (projectId: number) => {
    const boards = await this.boardRepository.getAllByProject(projectId);
    if (boards.length === 0) {
      throw CustomError.notFound({
        title: "Not found",
        message: "No boards found for this project",
        code: ErrorCodes.NOT_FOUND,
        details: null,
      });
    }
    return {
      boards,

      meta: { total: boards.length },
    };
  };
}

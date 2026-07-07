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
    return {
      boards,

      meta: { total: boards.length },
    };
  };
}

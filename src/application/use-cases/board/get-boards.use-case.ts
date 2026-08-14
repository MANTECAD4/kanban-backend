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

  public execute = async (userId: number) => {
    const boards = await this.boardRepository.getAllByUser(userId);
    return {
      boards,
      meta: { total: boards.length },
    };
  };
}

import { BoardRepository } from "../../../domain/repositories";

interface ClassDependencies {
  boardRepository: BoardRepository;
}

export class DeleteBoardUseCase {
  private readonly boardRepository: BoardRepository;
  constructor(dependencies: ClassDependencies) {
    const { boardRepository } = dependencies;
    this.boardRepository = boardRepository;
  }
  public execute = async (boardId: number) => {
    const deletedBoard = await this.boardRepository.delete(boardId);
    return {
      board: deletedBoard,
    };
  };
}

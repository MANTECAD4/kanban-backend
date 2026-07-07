import { BoardRepository } from "../../../domain/repositories";
import { SubmitBoardDto } from "../../dtos";

interface ClassDependencies {
  boardRepository: BoardRepository;
}

export class UpdateBoardUseCase {
  private readonly boardRepository: BoardRepository;
  constructor(dependencies: ClassDependencies) {
    const { boardRepository } = dependencies;
    this.boardRepository = boardRepository;
  }

  public execute = async (boardId: number, data: SubmitBoardDto) => {
    const board = await this.boardRepository.update(boardId, data);
    return {
      board,
    };
  };
}

import { CustomError } from "../../../domain/errors/custom-error";
import { BoardRepository } from "../../../domain/repositories";

export class DeleteBoardUseCase {
  constructor(private readonly boardRepository: BoardRepository) {}
  public execute = async (boarId: number) => {
    const existingBoard = await this.boardRepository.findById(boarId);
    if (!existingBoard)
      throw CustomError.internalServer(`Board with id ${boarId} not found.`);
    const deletedBoard = await this.boardRepository.delete(boarId);
    return {
      board: deletedBoard,
    };
  };
}

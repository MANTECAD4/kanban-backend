import { CustomError } from "../../../domain/errors/custom-error";
import { BoardRepository } from "../../../domain/repositories";
import { TokenReturnDto } from "../../dtos";

export class DeleteBoardUseCase {
  constructor(private readonly boardRepository: BoardRepository) {}
  public execute = async (user: TokenReturnDto, boarId: number) => {
    const existRelationship = await this.boardRepository.checkRelationship(
      user.sub.id,
      boarId,
    );
    if (!existRelationship)
      throw CustomError.forbidden(
        `Relation between user & board doesn't exist.`,
      );
    // const existingBoard = await this.boardRepository.getById(boarId);
    // if (!existingBoard)
    //   throw CustomError.internalServer(`Board with id ${boarId} not found.`);
    const deletedBoard = await this.boardRepository.delete(boarId);
    return {
      board: deletedBoard,
    };
  };
}

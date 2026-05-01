import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { BoardRepository } from "../../../domain/repositories";
import { getDefinedFields } from "../../../domain/services/get-defined-fields.service";
import { UpdateBoardDto } from "../../dtos";

interface ClassDependencies {
  boardRepository: BoardRepository;
}

interface ExecutionProps {
  userId: number;
  boardId: number;
  data: UpdateBoardDto;
}

export class UpdateBoardUseCase {
  private readonly boardRepository: BoardRepository;
  constructor(dependencies: ClassDependencies) {
    const { boardRepository } = dependencies;
    this.boardRepository = boardRepository;
  }

  public execute = async ({ userId, boardId, data }: ExecutionProps) => {
    const existsRelationship = await this.boardRepository.checkRelationship(
      userId,
      boardId,
    );

    if (!existsRelationship)
      throw CustomError.forbidden(
        `User doesn't own this board`,
        ErrorCodes.FORBIDDEN,
      );

    const definedFields = getDefinedFields(data);

    const { userId: _, ...rest } = await this.boardRepository.update(
      boardId,
      definedFields,
    );
    return {
      data: rest,
    };
  };
}

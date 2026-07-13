import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { StatusColumnRepository } from "../../../domain/repositories";

interface ClassDependencies {
  statusColumnRepository: StatusColumnRepository;
}

interface ExecutionProps {
  userId: number;
  columnId: number;
}

export class DeleteStatusColumnUseCase {
  private readonly statusColumnRepository: StatusColumnRepository;

  constructor(dependencies: ClassDependencies) {
    const { statusColumnRepository } = dependencies;
    this.statusColumnRepository = statusColumnRepository;
  }

  public execute = async ({ userId, columnId }: ExecutionProps) => {
    const existRelation = await this.statusColumnRepository.checkRelation(
      userId,
      columnId,
    );
    if (!existRelation)
      throw CustomError.forbidden({
        title: "Status column deletion failed",
        message: `User doesn't own specified status column`,
        code: ErrorCodes["FORBIDDEN"],
        details: null,
      });
    const deletedColumn = await this.statusColumnRepository.delete(columnId);
    return {
      category: deletedColumn,
    };
  };
}

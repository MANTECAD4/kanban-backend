import { CategoryRepository } from "../../../domain/repositories";
import { SubmitCategoryDto } from "../../dtos";

interface ClassDependencies {
  categoryRepository: CategoryRepository;
}

export class UpdateCategoryUseCase {
  private readonly categoryRepository: CategoryRepository;

  constructor(dependencies: ClassDependencies) {
    const { categoryRepository } = dependencies;
    this.categoryRepository = categoryRepository;
  }

  public execute = async (categoryId: number, data: SubmitCategoryDto) => {
    const updatedColumn = await this.categoryRepository.update(
      categoryId,
      data,
    );
    return {
      category: updatedColumn,
    };
  };
}

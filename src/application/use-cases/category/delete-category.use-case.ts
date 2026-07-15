import { CategoryRepository } from "../../../domain/repositories";

interface ClassDependencies {
  categoryRepository: CategoryRepository;
}

export class DeleteCategoryUseCase {
  private readonly categoryRepository: CategoryRepository;

  constructor(dependencies: ClassDependencies) {
    const { categoryRepository } = dependencies;
    this.categoryRepository = categoryRepository;
  }

  public execute = async (columnId: number) => {
    const deletedCategory = await this.categoryRepository.delete(columnId);
    return {
      category: deletedCategory,
    };
  };
}

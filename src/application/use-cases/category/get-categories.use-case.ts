import { CategoryRepository } from "../../../domain/repositories";

interface ClassDependencies {
  categoryRepository: CategoryRepository;
}

export class GetCategoryUseCase {
  private readonly categoryRepository: CategoryRepository;

  constructor(dependencies: ClassDependencies) {
    const { categoryRepository } = dependencies;
    this.categoryRepository = categoryRepository;
  }
  public execute = async (boardId: number) => {
    const categories = await this.categoryRepository.getAll(boardId);
    return {
      categories: categories,

      meta: { total: categories.length },
    };
  };
}

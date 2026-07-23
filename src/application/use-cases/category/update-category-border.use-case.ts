import { CategoryRepository } from "../../../domain/repositories";

interface Dependencies {
  categoryRepository: CategoryRepository;
}

export class UpdateCategoryOrderUseCase {
  private readonly categoryRepository: CategoryRepository;
  constructor(dependencies: Dependencies) {
    const { categoryRepository } = dependencies;
    this.categoryRepository = categoryRepository;
  }
  public execute = async (categoryId: number, order: number) => {
    const updatedCategory = await this.categoryRepository.updateOrder(
      categoryId,
      order,
    );

    return { category: updatedCategory };
  };
}

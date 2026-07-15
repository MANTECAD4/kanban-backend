import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { ProjectRepository } from "../../../domain/repositories/project.repository";

interface Dependencies {
  projectRepository: ProjectRepository;
}

export class GetProjectBySlugUseCase {
  private readonly projectRepository: ProjectRepository;

  constructor(dependencies: Dependencies) {
    const { projectRepository } = dependencies;

    this.projectRepository = projectRepository;
  }

  public execute = async (userId: number, slug: string) => {
    // Used checkRelation here beacuse it works the same as a get by search key in user collection
    // would do
    const project = await this.projectRepository.checkRelation(userId, slug);

    if (!project) {
      throw CustomError.notFound({
        title: "Project not found",
        message: "There were no coincidences",
        code: ErrorCodes.NOT_FOUND,
        details: null,
      });
    }

    return {
      project,
    };
  };
}

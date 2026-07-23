import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { ProjectRepository } from "../../../domain/repositories/project.repository";

interface Dependencies {
  projectRepository: ProjectRepository;
}

export class GetUserProjectsUseCase {
  private readonly projectRepository: ProjectRepository;
  constructor(dependencies: Dependencies) {
    const { projectRepository } = dependencies;
    this.projectRepository = projectRepository;
  }

  public execute = async (userId: number) => {
    const projects = await this.projectRepository.getAll(userId);
    if (projects.length === 0) {
      throw CustomError.notFound({
        title: "Not found",
        message: "No projects found for this project",
        code: ErrorCodes.NOT_FOUND,
        details: null,
      });
    }
    return {
      projects,
    };
  };
}

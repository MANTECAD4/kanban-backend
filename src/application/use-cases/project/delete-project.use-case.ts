import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { ProjectRepository } from "../../../domain/repositories/project.repository";

interface Dependencies {
  projectRepository: ProjectRepository;
}
export class DeleteProjectUseCase {
  private readonly projectRepository: ProjectRepository;
  constructor(dependencies: Dependencies) {
    const { projectRepository } = dependencies;
    this.projectRepository = projectRepository;
  }

  public execute = async (projectId: number) => {
    const existingProject = await this.projectRepository.getById(projectId);
    if (!existingProject) {
      throw CustomError.notFound({
        title: "Not found",
        message: "Referenced project not found",
        code: ErrorCodes.NOT_FOUND,
        details: null,
      });
    }

    const project = await this.projectRepository.delete(projectId);

    return { project };
  };
}

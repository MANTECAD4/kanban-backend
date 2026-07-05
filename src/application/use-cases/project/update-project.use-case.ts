import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { ProjectRepository } from "../../../domain/repositories/project.repository";
import { SubmitProjectDto } from "../../dtos/project.dto";

interface Dependencies {
  projectRepository: ProjectRepository;
}

export class UpdateProjectUseCase {
  private readonly projectRepository: ProjectRepository;
  constructor(dependencies: Dependencies) {
    const { projectRepository } = dependencies;
    this.projectRepository = projectRepository;
  }

  public execute = async (projectId: number, data: SubmitProjectDto) => {
    const existingProject = await this.projectRepository.getById(projectId);

    if (!existingProject) {
      throw CustomError.notFound({
        title: "Not found",
        message: "Referenced project not found",
        code: ErrorCodes.NOT_FOUND,
        details: null,
      });
    }

    const project = await this.projectRepository.update(projectId, data);

    return { project };
  };
}

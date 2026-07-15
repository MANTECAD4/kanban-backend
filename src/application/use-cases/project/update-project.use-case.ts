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
    const project = await this.projectRepository.update(projectId, data);

    return { project };
  };
}

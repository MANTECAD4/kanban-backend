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
    const project = await this.projectRepository.delete(projectId);

    return { project };
  };
}

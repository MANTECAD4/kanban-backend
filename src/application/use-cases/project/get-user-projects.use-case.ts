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

    return {
      projects,
    };
  };
}

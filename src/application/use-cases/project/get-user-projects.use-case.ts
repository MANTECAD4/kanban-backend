import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { UserRepository } from "../../../domain/repositories";
import { ProjectRepository } from "../../../domain/repositories/project.repository";

interface Dependencies {
  userRepository: UserRepository;
  projectRepository: ProjectRepository;
}

export class GetUserProjectsUseCase {
  private readonly userRepository: UserRepository;
  private readonly projectRepository: ProjectRepository;
  constructor(dependencies: Dependencies) {
    const { projectRepository, userRepository } = dependencies;
    this.userRepository = userRepository;
    this.projectRepository = projectRepository;
  }

  public execute = async (userId: number) => {
    const existingUser = await this.userRepository.getById(userId);
    if (!existingUser) {
      throw CustomError.notFound({
        title: "Projects query failed",
        message: "Referenced user not found",
        code: ErrorCodes.NOT_FOUND,
        details: null,
      });
    }

    const projects = await this.projectRepository.getAll(userId);

    return {
      projects,
    };
  };
}

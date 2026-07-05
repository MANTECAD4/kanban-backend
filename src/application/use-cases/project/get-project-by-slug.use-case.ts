import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { UserRepository } from "../../../domain/repositories";
import { ProjectRepository } from "../../../domain/repositories/project.repository";

interface Dependencies {
  userRepository: UserRepository;
  projectRepository: ProjectRepository;
}

const errorTitle = "Project fetching failed";
export class GetProjectBySlugUseCase {
  private readonly userRepository: UserRepository;
  private readonly projectRepository: ProjectRepository;

  constructor(dependencies: Dependencies) {
    const { userRepository, projectRepository } = dependencies;

    this.userRepository = userRepository;
    this.projectRepository = projectRepository;
  }

  public execute = async (userId: number, slug: string) => {
    const existingUser = await this.userRepository.getById(userId);
    if (!existingUser) {
      throw CustomError.notFound({
        title: errorTitle,
        message: "User not found",
        code: ErrorCodes.NOT_FOUND,
        details: null,
      });
    }

    const project = await this.projectRepository.getByUserAndSlug(userId, slug);

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

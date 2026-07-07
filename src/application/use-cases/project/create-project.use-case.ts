import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { UserRepository } from "../../../domain/repositories";
import { ProjectRepository } from "../../../domain/repositories/project.repository";
import { SubmitProjectDto } from "../../dtos/project.dto";

interface Dependencies {
  userRepository: UserRepository;
  projectRepository: ProjectRepository;
}

export class CreateProjectUseCase {
  private readonly userRepository: UserRepository;
  private readonly projectRepository: ProjectRepository;

  constructor(dependencies: Dependencies) {
    const { projectRepository, userRepository } = dependencies;
    this.userRepository = userRepository;
    this.projectRepository = projectRepository;
  }

  public execute = async (userId: number, data: SubmitProjectDto) => {
    const errorMsgTitle = "Project creation failed";

    const existingUser = await this.userRepository.getById(userId);
    if (!existingUser) {
      throw CustomError.notFound({
        title: errorMsgTitle,
        message: "Referenced user not found",
        code: ErrorCodes.NOT_FOUND,
        details: null,
      });
    }

    const existingProjectInUserCollection =
      await this.projectRepository.checkRelation(userId, data.slug);

    if (existingProjectInUserCollection) {
      throw CustomError.badRequest({
        title: errorMsgTitle,
        message: "Name already registered in user's collection",
        code: ErrorCodes.BAD_REQUEST,
        details: null,
      });
    }

    const createdProject = await this.projectRepository.create(userId, data);

    return {
      project: createdProject,
    };
  };
}

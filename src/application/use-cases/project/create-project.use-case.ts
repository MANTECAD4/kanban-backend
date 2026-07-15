import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { ProjectRepository } from "../../../domain/repositories/project.repository";
import { SubmitProjectDto } from "../../dtos/project.dto";

interface Dependencies {
  projectRepository: ProjectRepository;
}

export class CreateProjectUseCase {
  private readonly projectRepository: ProjectRepository;

  constructor(dependencies: Dependencies) {
    const { projectRepository } = dependencies;
    this.projectRepository = projectRepository;
  }

  public execute = async (userId: number, data: SubmitProjectDto) => {
    const errorMsgTitle = "Project creation failed";

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

import { SubmitProjectDto } from "../../application/dtos/project.dto";
import { ProjectEntity } from "../entities/project.entity";

export abstract class ProjectRepository {
  public abstract getAll: (userId: number) => Promise<ProjectEntity[]>;

  public abstract getById: (projectId: number) => Promise<ProjectEntity | null>;

  public abstract checkRelation: (
    userId: number,
    searchKey: string | number,
  ) => Promise<ProjectEntity | null>;

  public abstract create: (
    userId: number,
    createProjectDto: SubmitProjectDto,
  ) => Promise<ProjectEntity>;

  public abstract update: (
    projectId: number,
    data: SubmitProjectDto,
  ) => Promise<ProjectEntity>;

  public abstract delete: (ProjectId: number) => Promise<ProjectEntity>;
}

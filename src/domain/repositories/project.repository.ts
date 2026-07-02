import { CreateProjectDto } from "../../application/dtos/project.dto";
import { ProjectEntity } from "../entities/project.entity";

export abstract class ProjectRepository {
  public abstract checkRelation: (
    userId: number,
    projectId: number,
  ) => Promise<ProjectEntity | null>;

  public abstract getAll: (userId: number) => Promise<ProjectEntity[]>;

  public abstract getById: (projectId: number) => Promise<ProjectEntity | null>;

  public abstract getByUserAndSlug: (
    userId: number,
    slug: string,
  ) => Promise<ProjectEntity | null>;

  public abstract create: (
    userId: number,
    createProjectDto: CreateProjectDto,
  ) => Promise<ProjectEntity>;

  public abstract update: (
    projectId: number,
    data: Record<string, any>,
  ) => Promise<ProjectEntity>;

  public abstract delete: (ProjectId: number) => Promise<ProjectEntity>;
}

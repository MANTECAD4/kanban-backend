import { SubmitProjectDto } from "../../application/dtos/project.dto";
import { prisma } from "../../data/init-postgres";
import { ProjectEntity } from "../../domain/entities/project.entity";
import { ProjectRepository } from "../../domain/repositories/project.repository";

export class PostgresProjectRepository implements ProjectRepository {
  public getAll = async (userId: number): Promise<ProjectEntity[]> => {
    const rawProjects = await prisma.project.findMany({
      where: { user_id: userId },
    });

    return rawProjects.map((project) => ProjectEntity.fromObject(project));
  };

  public getById = async (projectId: number): Promise<ProjectEntity | null> => {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    return project ? ProjectEntity.fromObject(project) : null;
  };

  public checkRelation = async (
    userId: number,
    searchKey: string | number,
  ): Promise<ProjectEntity | null> => {
    let project;
    if (typeof searchKey === "string") {
      project = await prisma.project.findFirst({
        where: { slug: searchKey, user: { id: userId } },
      });
    } else {
      project = await prisma.project.findUnique({
        where: { id: searchKey, user: { id: userId } },
      });
    }

    return project ? ProjectEntity.fromObject(project) : null;
  };

  public create = async (
    userId: number,
    { iconColor, ...rest }: SubmitProjectDto,
  ): Promise<ProjectEntity> => {
    const project = await prisma.project.create({
      data: { user_id: userId, icon_color: iconColor, ...rest },
    });

    return ProjectEntity.fromObject(project);
  };

  public update = async (
    projectId: number,
    { iconColor, ...rest }: SubmitProjectDto,
  ): Promise<ProjectEntity> => {
    const project = await prisma.project.update({
      where: { id: projectId },
      data: { icon_color: iconColor, ...rest },
    });

    return ProjectEntity.fromObject(project);
  };

  public delete = async (projectId: number): Promise<ProjectEntity> => {
    const project = await prisma.project.delete({ where: { id: projectId } });
    return ProjectEntity.fromObject(project);
  };
}

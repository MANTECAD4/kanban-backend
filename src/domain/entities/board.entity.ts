import { IconColor } from "../../generated/enums";
import { CategoryEntity } from "./category.entity";
import { TagEntity } from "./tag.entity";
import { ProjectEntity } from "./project.entity";

export interface BoardMetaData {
  numCompletedTasks: number;
  numStartedTasks: number;
  numNotStartedTasks: number;
}

interface BoardProps {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  iconColor: IconColor;
  project: ProjectEntity | null;
  projectId: number;
  statusColumns: CategoryEntity[] | null;
  tags: TagEntity[] | null;
  meta: BoardMetaData | null;
}

export class BoardEntity {
  public readonly id: number;
  public readonly name: string;
  public readonly slug: string;
  public readonly description: string;
  public readonly icon: string;
  public readonly iconColor: IconColor;
  public readonly project: ProjectEntity | null;
  public readonly projectId: number;
  public readonly statusColumns: CategoryEntity[] | null;
  public readonly tags: TagEntity[] | null;
  public readonly meta: BoardMetaData | null;

  constructor(options: BoardProps) {
    const {
      id,
      name,
      slug,
      projectId,
      description,
      icon,
      iconColor,
      project = null,
      statusColumns = null,
      tags = null,
      meta = null,
    } = options;

    this.id = id;
    this.name = name;
    this.slug = slug;
    this.icon = icon;
    this.iconColor = iconColor;
    this.projectId = projectId;
    this.description = description;
    this.project = project;
    this.statusColumns = statusColumns;
    this.tags = tags;
    this.meta = meta;
  }

  public static fromObject = (object: Record<string, any>): BoardEntity => {
    const {
      id,
      _id,
      name,
      slug,
      icon,
      icon_color,
      project_id,
      description,
      project,
      status_columns,
      tags,
      meta,
    } = object;

    const boardInstace = new BoardEntity({
      id: id ?? _id,
      name,
      slug,
      description,
      icon,
      iconColor: icon_color,
      projectId: project_id,
      project,
      statusColumns: status_columns,
      tags,
      meta,
    });

    return boardInstace;
  };
}

import { IconColor } from "../../application/dtos/project.dto";
import { BoardEntity } from "./board.entity";

interface ProjectProps {
  id: number;
  name: string;
  description: string;
  icon: string;
  iconColor: IconColor;
  slug: string;
  boards: BoardEntity[] | null;
}

export class ProjectEntity {
  public readonly id: number;
  public readonly name: string;
  public readonly description: string;
  public readonly icon: string;
  public readonly iconColor: IconColor;
  public readonly slug: string;
  public readonly boards: BoardEntity[] | null;

  constructor(props: ProjectProps) {
    const {
      id,
      name,
      description,
      icon,
      iconColor,
      slug,
      boards = null,
    } = props;

    this.id = id;
    this.name = name;
    this.description = description;
    this.icon = icon;
    this.iconColor = iconColor;
    this.slug = slug;
    this.boards = boards;
  }

  public static fromObject = (object: Record<string, any>): ProjectEntity => {
    const { id, _id, name, description, icon, icon_color, slug, boards } =
      object;
    const projectInstace = new ProjectEntity({
      id: id ?? _id,
      name,
      description,
      icon,
      slug,
      iconColor: icon_color,
      boards,
    });

    return projectInstace;
  };
}

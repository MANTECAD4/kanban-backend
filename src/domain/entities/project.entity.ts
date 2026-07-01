import { IconColor } from "../../application/dtos/project.dto";
import { BoardEntity } from "./board.entity";

interface ProjectProps {
  id: number;
  name: string;
  description: string;
  icon: string;
  iconColor: IconColor;
  boards: BoardEntity[] | null;
}

export class ProjectEntity {
  public readonly id: number;
  public readonly name: string;
  public readonly description: string;
  public readonly icon: string;
  public readonly iconColor: IconColor;
  public readonly boards: BoardEntity[] | null;

  constructor(props: ProjectProps) {
    const { id, name, description, icon, iconColor, boards } = props;

    this.id = id;
    this.name = name;
    this.description = description;
    this.icon = icon;
    this.iconColor = iconColor;
    this.boards = boards;
  }

  public static fromObject = (object: Record<string, any>): ProjectEntity => {
    const { id, _id, name, description, icon, icon_color, boards } = object;
    const projectInstace = new ProjectEntity({
      id: id ?? _id,
      name,
      description,
      icon,
      iconColor: icon_color,
      boards,
    });

    return projectInstace;
  };
}

import { CustomError, ErrorCodes } from "../errors/custom-error";

interface BoardProps {
  id: number;
  name: string;
  description?: string;
  userId: number;
}

export class BoardEntity {
  public id: number;
  public name: string;
  public description?: string;
  public userId: number;

  constructor(options: BoardProps) {
    const { id, name, userId, description } = options;

    this.id = id;
    this.name = name;
    this.userId = userId;
    if (description) this.description = description;
  }

  public static fromObject = (object: Record<string, any>): BoardEntity => {
    const { id, _id, name, userId, user_id, description } = object;

    const boardInstace = new BoardEntity({
      id: id ?? _id,
      name,
      userId: user_id ?? userId,
      description,
    });

    if (boardInstace.id === undefined || typeof boardInstace.id !== "number") {
      throw new Error(
        "Data from BD is corrupted. Invalid value for id property",
      );
    }

    if (
      boardInstace.name === undefined ||
      typeof boardInstace.name !== "string"
    ) {
      throw new Error(
        "Data from BD is corrupted. Invalid value for name property",
      );
    }

    if (
      boardInstace.userId === undefined ||
      typeof boardInstace.userId !== "number"
    ) {
      throw new Error(
        "Data from BD is corrupted. Invalid value for userId property",
      );
    }

    return boardInstace;
  };
}

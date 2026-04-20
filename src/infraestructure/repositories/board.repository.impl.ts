import { BoardDatasource } from "../../domain/datasources";
import { BoardEntity } from "../../domain/entities";
import { BoardRepository } from "../../domain/repositories";
import {
  CreateBoardDto,
  UpdateBoardDto,
} from "../../application/dtos/board.dto";

export class BoardRepositoryImpl implements BoardRepository {
  constructor(private readonly boardDatasource: BoardDatasource) {}
  public findAll = async (userId: number): Promise<BoardEntity[]> => {
    return await this.boardDatasource.findAll(userId);
  };
  public create = async (
    createBoardDto: CreateBoardDto,
  ): Promise<BoardEntity> => {
    return await this.boardDatasource.create(createBoardDto);
  };
  public update = async (
    boardId: number,
    updateBoardDto: UpdateBoardDto,
  ): Promise<BoardEntity> => {
    return await this.boardDatasource.update(boardId, updateBoardDto);
  };
  public delete = async (boardId: number): Promise<BoardEntity> => {
    return await this.boardDatasource.delete(boardId);
  };
}

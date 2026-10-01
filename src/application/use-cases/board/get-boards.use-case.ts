import { BoardRepository, TaskRepository } from "../../../domain/repositories";

interface ClassDependencies {
  boardRepository: BoardRepository;
  taskRepository: TaskRepository;
}

export class GetBoardsUseCase {
  private readonly boardRepository: BoardRepository;
  private readonly taskRepository: TaskRepository;
  constructor(dependencies: ClassDependencies) {
    const { boardRepository, taskRepository } = dependencies;
    this.boardRepository = boardRepository;
    this.taskRepository = taskRepository;
  }

  public execute = async (userId: number) => {
    const boards = await this.boardRepository.getAllByUser(userId);

    const addMetaToBoards = boards.map(async (board) => {
      let numNotApplicableTasks: number = 0;
      let numCompletedTasks: number = 0;
      let numStartedTasks: number = 0;
      let numNotStartedTasks: number = 0;

      const boardTasks = await this.taskRepository.getAllByBoardWithSubtasks(
        board.id,
      );

      boardTasks.forEach((task) => {
        if (task.subtasks!.length === 0) {
          return numNotApplicableTasks++;
        }
        if (
          task.subtasks!.filter((subtask) => subtask.isCompleted).length === 0
        ) {
          return numNotStartedTasks++;
        }
        if (
          task.subtasks!.filter((subtask) => subtask.isCompleted).length ===
          task.subtasks!.length
        ) {
          return numCompletedTasks++;
        }

        return numStartedTasks++;
      });

      return {
        ...board,
        meta: {
          total: boardTasks.length,
          numNotApplicableTasks,
          numCompletedTasks,
          numStartedTasks,
          numNotStartedTasks,
        },
      };
    });

    const boardsWithMeta = await Promise.all(addMetaToBoards);

    return {
      boards: boardsWithMeta,
      meta: { total: boards.length },
    };
  };
}

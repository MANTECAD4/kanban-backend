import { Request, Response } from "express";
import { GetSubtasksUseCase } from "../../application/use-cases/subtask/get-subtasks.use-case";
import { CreateSubtaskUseCase } from "../../application/use-cases/subtask/create-subtask.use-case";
import { UpdateSubtaskDescriptionUseCase } from "../../application/use-cases/subtask/update-subtask.use-case";
import { DeleteSubtaskUseCase } from "../../application/use-cases/subtask/delete-subtask.use-case";
import { CustomError } from "../../domain/errors/custom-error";
import { SubmitSubtaskDto } from "../../application/dtos/subtask.dto";

export class SubtaskController {
  constructor(
    private readonly getSubtasksUseCase: GetSubtasksUseCase,
    private readonly createSubtaskUsecase: CreateSubtaskUseCase,
    private readonly updateSubtaskDescriptionUseCase: UpdateSubtaskDescriptionUseCase,
    private readonly deleteSubtaskUseCase: DeleteSubtaskUseCase,
  ) {}

  public getAllByTask = async (req: Request, res: Response) => {
    try {
      const result = await this.getSubtasksUseCase.execute({
        userId: req.user!.sub.id,
        taskId: req.validatedParams!.taskId,
      });
      return res.json({
        ok: true,
        message: "Subtasks loaded succesfully",
        ...result,
      });
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
  };
  public create = async (req: Request, res: Response) => {
    try {
      const result = await this.createSubtaskUsecase.execute(
        req.validatedParams!.taskId,
        req.validatedBody! as SubmitSubtaskDto,
      );
      return res.json({
        ok: true,
        message: "Subtask created succesfully",
        ...result,
      });
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
  };
  public updateDescription = async (req: Request, res: Response) => {
    try {
      const result = await this.updateSubtaskDescriptionUseCase.execute(
        req.validatedParams!.subtaskId,
        req.validatedBody!.description,
      );
      return res.json({
        ok: true,
        message: "Subtask description updated succesfully",
        ...result,
      });
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
  };
  public delete = async (req: Request, res: Response) => {
    try {
      const result = await this.deleteSubtaskUseCase.execute({
        userId: req.user!.sub.id,
        subtaskId: req.validatedParams!.subtaskId,
      });
      return res.json({
        ok: true,
        message: "Subtask deleted succesfully",
        ...result,
      });
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
  };
}

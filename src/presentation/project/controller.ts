import { Request, Response } from "express";
import { CreateProjectUseCase } from "../../application/use-cases/project/create-project.use-case";
import { CustomError } from "../../domain/errors/custom-error";
import { CreateProjectDto } from "../../application/dtos/project.dto";

export class ProjectController {
  constructor(private readonly createProjectUseCase: CreateProjectUseCase) {}

  public getAllByUser = async (req: Request, res: Response) => {
    return res.json("getProjetsByUser");
  };
  public create = async (req: Request, res: Response) => {
    try {
      const result = await this.createProjectUseCase.execute(
        req.user!.sub.id,
        req.validatedBody as CreateProjectDto,
      );

      return res
        .status(201)
        .json({ ok: true, message: "Project created succesfully", ...result });
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
  };
  public update = (req: Request, res: Response) => {
    return res.json("updateProject");
  };
  public delete = (req: Request, res: Response) => {
    return res.json("deleteProject");
  };
}

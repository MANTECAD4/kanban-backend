import { Request, Response } from "express";
import { CreateProjectUseCase } from "../../application/use-cases/project/create-project.use-case";
import { CustomError } from "../../domain/errors/custom-error";
import { CreateProjectDto } from "../../application/dtos/project.dto";
import { GetUserProjectsUseCase } from "../../application/use-cases/project/get-user-projects.use-case";

export class ProjectController {
  constructor(
    private readonly createProjectUseCase: CreateProjectUseCase,
    private readonly getUserProjectsUseCase: GetUserProjectsUseCase,
  ) {}

  public getAllByUser = async (req: Request, res: Response) => {
    try {
      const result = await this.getUserProjectsUseCase.execute(
        req.user!.sub.id,
      );
      return res.json({
        ok: true,
        message: "Projects fetched successfully",
        ...result,
      });
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
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

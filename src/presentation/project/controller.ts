import { Request, Response } from "express";
import { CreateProjectUseCase } from "../../application/use-cases/project/create-project.use-case";
import { CustomError } from "../../domain/errors/custom-error";
import { SubmitProjectDto } from "../../application/dtos/project.dto";
import { GetUserProjectsUseCase } from "../../application/use-cases/project/get-user-projects.use-case";
import { GetProjectBySlugUseCase } from "../../application/use-cases/project/get-project-by-slug.use-case";
import { UpdateProjectUseCase } from "../../application/use-cases/project/update-project.use-case";

export class ProjectController {
  constructor(
    private readonly createProjectUseCase: CreateProjectUseCase,
    private readonly getUserProjectsUseCase: GetUserProjectsUseCase,
    private readonly getProjectBySlugUseCase: GetProjectBySlugUseCase,
    private readonly updateProjectUseCase: UpdateProjectUseCase,
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

  public getByUserAndSlug = async (req: Request, res: Response) => {
    try {
      const result = await this.getProjectBySlugUseCase.execute(
        req.user!.sub.id,
        req.validatedParams!.projectSlug,
      );

      return res.json({
        ok: true,
        message: "Project fetched successfully",
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
        req.validatedBody as SubmitProjectDto,
      );

      return res
        .status(201)
        .json({ ok: true, message: "Project created succesfully", ...result });
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
  };
  public update = async (req: Request, res: Response) => {
    try {
      const result = await this.updateProjectUseCase.execute(
        req.validatedParams!.projectId,
        req.validatedBody as SubmitProjectDto,
      );

      return res.json({
        ok: true,
        message: "Project updated succesfully",
        ...result,
      });
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
  };
  public delete = (req: Request, res: Response) => {
    return res.json("deleteProject");
  };
}

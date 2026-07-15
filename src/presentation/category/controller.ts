import { Request, Response } from "express";
import { CreateCategoryUseCase } from "../../application/use-cases/category/create-category.use-case";
import { CustomError } from "../../domain/errors/custom-error";
import { SubmitCategoryDto } from "../../application/dtos";
import { GetCategoryUseCase } from "../../application/use-cases/category/get-categories.use-case";
import { UpdateCategoryUseCase } from "../../application/use-cases/category/update_category.use-case";
import { DeleteCategoryUseCase } from "../../application/use-cases/category/delete-category.use-case";

export class CategoryController {
  constructor(
    private readonly getStatusColumnsUsecase: GetCategoryUseCase,
    private readonly createStatusColumnUsecase: CreateCategoryUseCase,
    private readonly updateStatusColumnsUsecase: UpdateCategoryUseCase,
    private readonly deleteStatusColumnsUsecase: DeleteCategoryUseCase,
  ) {}

  public getAll = async (req: Request, res: Response) => {
    try {
      const result = await this.getStatusColumnsUsecase.execute(
        req.validatedParams!.boardId,
      );
      return res.json({
        ok: true,
        message: `Categories loaded succesfully`,
        ...result,
      });
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
  };
  public create = async (req: Request, res: Response) => {
    try {
      const result = await this.createStatusColumnUsecase.execute(
        req.validatedParams!.boardId,
        req.validatedBody! as SubmitCategoryDto,
      );

      return res.status(201).json({
        ok: true,
        message: `Category created succesfully`,
        ...result,
      });
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
  };

  public update = async (req: Request, res: Response) => {
    try {
      const result = await this.updateStatusColumnsUsecase.execute(
        req.validatedParams!.categoryId,

        req.validatedBody as SubmitCategoryDto,
      );
      return res.json({
        ok: true,
        message: `Category updated succesfully`,
        ...result,
      });
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
  };

  public delete = async (req: Request, res: Response) => {
    try {
      const result = await this.deleteStatusColumnsUsecase.execute(
        req.validatedParams!.categoryId,
      );

      return res.json({
        ok: true,
        message: `Category deleted succesfully`,
        ...result,
      });
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
  };
}

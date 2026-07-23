import { Request, Response } from "express";
import { CreateCategoryUseCase } from "../../application/use-cases/category/create-category.use-case";
import { CustomError } from "../../domain/errors/custom-error";
import { SubmitCategoryDto } from "../../application/dtos";
import { GetCategoryUseCase } from "../../application/use-cases/category/get-categories.use-case";
import { UpdateCategoryUseCase } from "../../application/use-cases/category/update_category.use-case";
import { DeleteCategoryUseCase } from "../../application/use-cases/category/delete-category.use-case";
import { UpdateCategoryOrderUseCase } from "../../application/use-cases/category/update-category-border.use-case";

export class CategoryController {
  constructor(
    private readonly getCategoriesUsecase: GetCategoryUseCase,
    private readonly createCategoryUsecase: CreateCategoryUseCase,
    private readonly updateCategoryUsecase: UpdateCategoryUseCase,
    private readonly updateCategoryOrderUsecase: UpdateCategoryOrderUseCase,

    private readonly deleteStatusColumnsUsecase: DeleteCategoryUseCase,
  ) {}

  public getAll = async (req: Request, res: Response) => {
    try {
      const result = await this.getCategoriesUsecase.execute(
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
      const result = await this.createCategoryUsecase.execute(
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
      const result = await this.updateCategoryUsecase.execute(
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

  public updateOrder = async (req: Request, res: Response) => {
    try {
      const result = await this.updateCategoryOrderUsecase.execute(
        req.validatedParams!.categoryId,

        req.validatedBody!.order,
      );
      return res.json({
        ok: true,
        message: `Category order updated succesfully`,
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

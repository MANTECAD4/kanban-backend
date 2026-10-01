import { Request, Response } from "express";
import { SeedDatabaseUseCase } from "../../../application/use-cases/shared/seed-db.use-case";
import { CustomError } from "../../../domain/errors/custom-error";
export class SeedController {
  constructor(private readonly seedDatabaseUseCase: SeedDatabaseUseCase) {}
  public seedDatabase = async (req: Request, res: Response) => {
    try {
      await this.seedDatabaseUseCase.execute();
      return res.json("Seed executed...");
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
  };
}

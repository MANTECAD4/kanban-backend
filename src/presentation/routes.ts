import { Router } from "express";
import { AuthRoutes } from "./auth/routes";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.use("/api/auth", AuthRoutes.routes);
    // router.use("/api/boards");
    // router.use("/api/columns");
    // router.use("/api/tasks");
    return router;
  }
}

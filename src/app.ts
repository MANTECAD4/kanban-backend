import { createServer } from "node:http";
import { envs } from "./configs/envs";
import { prisma } from "./data/init-postgres";
import { Server } from "./presentation/server";
import { AppRoutes } from "./presentation/routes";

(async () => {
  main();
})();

function main() {
  const { PORT: port } = envs();
  const server = new Server({ port });

  server.setRoutes(AppRoutes.routes);

  const httpServer = createServer(server.app);

  httpServer.listen(port, () => {
    console.log(`Server running on ${port}`);
  });
}

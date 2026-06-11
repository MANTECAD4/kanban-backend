import express, { Router } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

interface ServerOptions {
  port: number;
}

export class Server {
  public readonly app = express();

  private serverListener?: any;
  private readonly port: number;

  constructor({ port }: ServerOptions) {
    this.port = port;
    this.configure();
  }

  public configure() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.app.use(cors({ origin: "http://localhost:5173", credentials: true }));
    this.app.use(helmet());
    this.app.use(cookieParser());
    this.app.use(morgan("dev"));
  }

  public setRoutes(routes: Router) {
    this.app.use(routes);
  }

  public async start() {
    console.log({ port: this.port, type: typeof this.port });
    this.serverListener = this.app.listen(this.port, () => {
      console.log(`Server listening on port ${this.port}`);
    });
  }
  public async close() {
    this.serverListener.close();
  }
}

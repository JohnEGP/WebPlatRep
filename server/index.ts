import express from "express";
import cors from "cors";
import { handlePing } from "./routes/ping";
import { handleDemo } from "./routes/demo";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // API routes
  app.get("/api/ping", handlePing);
  app.get("/api/demo", handleDemo);

  return app;
}

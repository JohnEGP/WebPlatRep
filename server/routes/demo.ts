import { RequestHandler } from "express";
import { DemoResponse } from "@shared/api";

export const handleDemo: RequestHandler = (req, res) => {
  const response: DemoResponse = {
    message: "Hello from the demo API endpoint!",
    timestamp: new Date().toISOString(),
  };
  res.json(response);
};

import { RequestHandler } from "express";
import { PingResponse } from "@shared/api";

export const handlePing: RequestHandler = (req, res) => {
  const response: PingResponse = {
    status: "ok",
    timestamp: new Date().toISOString(),
  };
  res.json(response);
};

import { Router } from "express";

import { apiResponse } from "../utils/apiResponse.js";
import { healthRouter } from "./health.routes.js";

export const apiRouter = Router();

apiRouter.get("/", (_request, response) => {
  response
    .status(200)
    .json(apiResponse({ documentation: null, health: "/health" }, "Welcome to the MyNSUT API"));
});

apiRouter.use("/health", healthRouter);

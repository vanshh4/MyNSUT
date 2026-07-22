import { Router } from "express";

import { authRouter } from "../modules/auth/auth.routes.js";
import { studentsRouter } from "../modules/students/students.routes.js";
import { apiResponse } from "../utils/apiResponse.js";
import { healthRouter } from "./health.routes.js";

export const apiRouter = Router();

apiRouter.get("/", (_request, response) => {
  response.status(200).json(
    apiResponse(
      {
        documentation: null,
        health: "/health",
        authentication: "/auth",
        students: "/students",
      },
      "Welcome to the MyNSUT API"
    )
  );
});

apiRouter.use("/health", healthRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/students", studentsRouter);

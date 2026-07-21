import type { RequestHandler } from "express";

import { appConfig } from "../config/app.js";
import { apiResponse } from "../utils/apiResponse.js";

export const getHealth: RequestHandler = (_request, response) => {
  response.status(200).json(
    apiResponse(
      {
        status: "ok",
        service: appConfig.name,
        environment: appConfig.environment,
        uptimeSeconds: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
      },
      "MyNSUT API is healthy"
    )
  );
};

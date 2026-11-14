import type { RequestHandler } from "express";

import { appConfig } from "../config/app.js";
import { checkDatabaseHealth } from "../db/prisma.js";
import { apiResponse } from "../utils/apiResponse.js";

export const getHealth: RequestHandler = async (request, response) => {
  const checkDb = request.query.db === "true" || request.query.readiness === "true";

  if (checkDb) {
    const dbHealth = await checkDatabaseHealth();
    const statusCode = dbHealth.connected ? 200 : 503;

    response.status(statusCode).json(
      apiResponse(
        {
          status: dbHealth.connected ? "ok" : "degraded",
          service: appConfig.name,
          environment: appConfig.environment,
          uptimeSeconds: Math.floor(process.uptime()),
          timestamp: new Date().toISOString(),
          database: dbHealth,
        },
        dbHealth.connected ? "MyNSUT API and database are healthy" : "Database connectivity check failed"
      )
    );
    return;
  }

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

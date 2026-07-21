import cors from "cors";
import express from "express";
import helmet from "helmet";

import { appConfig } from "./config/app.js";
import { corsOptions } from "./config/cors.js";
import { env } from "./config/env.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { notFoundMiddleware } from "./middlewares/notFound.middleware.js";
import { requestIdMiddleware, requestLogger } from "./middlewares/requestLogger.middleware.js";
import { apiRouter } from "./routes/index.js";

export const app = express();

app.disable("x-powered-by");
app.set("trust proxy", env.TRUST_PROXY);

app.use(requestIdMiddleware);
app.use(requestLogger);
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.use(appConfig.apiPrefix, apiRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

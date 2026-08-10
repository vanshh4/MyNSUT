import { Router } from "express";

import { adminRouter } from "../modules/admin/admin.routes.js";
import { auditRouter } from "../modules/audit/audit.routes.js";
import { authRouter } from "../modules/auth/auth.routes.js";
import { studentsRouter } from "../modules/students/students.routes.js";
import { profilesRouter } from "../modules/profiles/profiles.routes.js";
import { privacyRouter } from "../modules/privacy/privacy.routes.js";
import { academicsRouter } from "../modules/academics/academics.routes.js";
import { searchRouter } from "../modules/search/search.routes.js";
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
        admin: "/admin",
        auditLogs: "/audit-logs",
        profiles: "/profiles",
        privacy: "/privacy",
        academics: "/academics",
        search: "/search",
      },
      "Welcome to the MyNSUT API"
    )
  );
});

apiRouter.use("/health", healthRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/students", studentsRouter);
apiRouter.use("/admin", adminRouter);
apiRouter.use("/audit-logs", auditRouter);
apiRouter.use("/profiles", profilesRouter);
apiRouter.use("/privacy", privacyRouter);
apiRouter.use("/academics", academicsRouter);
apiRouter.use("/search", searchRouter);

import type { AuthContext, SafeAuthenticatedUser } from "../modules/auth/auth.types.js";

declare global {
  namespace Express {
    interface Request {
      auth?: AuthContext & { user: SafeAuthenticatedUser };
    }
  }
}

export {};

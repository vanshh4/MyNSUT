export {
  AUTH_ERROR_CODES,
  AUTH_PROVIDER,
  OFFICIAL_EMAIL_DOMAIN,
} from "@mynsut/shared/constants/auth";
export type { AuthErrorCode } from "@mynsut/shared/constants/auth";

/** Backend-only cookie identifiers; never expose cookie values through shared contracts. */
export const AUTH_COOKIE_NAMES = {
  SESSION: "mynsut_session",
  OAUTH_STATE: "mynsut_oauth_state",
  OAUTH_NONCE: "mynsut_oauth_nonce",
  OAUTH_CODE_VERIFIER: "mynsut_oauth_code_verifier",
} as const;

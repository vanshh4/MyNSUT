const SENSITIVE_KEYS = new Set([
  "authorization",
  "cookie",
  "set-cookie",
  "token",
  "sessiontoken",
  "rawsessiontoken",
  "password",
  "secret",
  "clientsecret",
  "client_secret",
  "codeverifier",
  "code_verifier",
  "state",
  "nonce",
  "jwt",
  "apikey",
  "api_key",
  "access_token",
  "refresh_token",
  "id_token",
]);

/**
 * Deeply redacts sensitive keys from objects, arrays, and query strings
 * before they can be recorded to logs or telemetry outputs.
 */
export function redactLogData<T>(input: T): T {
  if (input === null || input === undefined) {
    return input;
  }

  if (typeof input === "string") {
    // If it looks like a Cookie header string (e.g. name=val; name2=val2)
    if (input.includes("=") && (input.includes(";") || input.includes("bearer "))) {
      return input.replace(/([a-zA-Z0-9_-]+)=([^;]+)/g, "$1=[REDACTED]") as unknown as T;
    }
    return input;
  }

  if (Array.isArray(input)) {
    return input.map((item) => redactLogData(item)) as unknown as T;
  }

  if (typeof input === "object") {
    const sanitized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
      const lowerKey = key.toLowerCase();
      if (SENSITIVE_KEYS.has(lowerKey)) {
        sanitized[key] = "[REDACTED]";
      } else if (value && typeof value === "object") {
        sanitized[key] = redactLogData(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized as T;
  }

  return input;
}


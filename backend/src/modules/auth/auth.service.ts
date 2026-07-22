import { UserStatus } from "@prisma/client";

import { prisma } from "../../db/prisma.js";
import {
  accountDeleted,
  accountSuspended,
  googleSubjectConflict,
} from "./auth.errors.js";
import * as authRepository from "./auth.repository.js";
import { issueSession } from "./session.service.js";
import type { AuthenticationResult, GoogleIdentity, SessionMetadata } from "./auth.types.js";

function assertActive(status: UserStatus): void {
  if (status === UserStatus.SUSPENDED) throw accountSuspended();
  if (status === UserStatus.DELETED) throw accountDeleted();
}

export async function authenticateGoogleIdentity(
  identity: GoogleIdentity,
  metadata: SessionMetadata
): Promise<AuthenticationResult> {
  const user = await prisma.$transaction(async (tx) => {
    const [bySubject, byEmail] = await Promise.all([
      authRepository.findUserByGoogleSubject(tx, identity.subject),
      authRepository.findUserByEmail(tx, identity.email),
    ]);

    if (bySubject && byEmail && bySubject.id !== byEmail.id) {
      throw googleSubjectConflict();
    }

    if (bySubject) {
      assertActive(bySubject.status);
      if (bySubject.email !== identity.email) throw googleSubjectConflict();
      return authRepository.updateGoogleProfile(tx, bySubject.id, identity);
    }

    if (byEmail) {
      assertActive(byEmail.status);
      if (byEmail.googleSubject && byEmail.googleSubject !== identity.subject) {
        throw googleSubjectConflict();
      }
      return authRepository.linkGoogleIdentity(tx, byEmail.id, identity);
    }

    return authRepository.createGoogleUser(tx, identity);
  });

  const issued = await issueSession(user.id, metadata);
  const resolved = await import("./session.service.js").then(({ resolveSession }) =>
    resolveSession(issued.rawSessionToken)
  );

  return {
    user: resolved.user,
    rawSessionToken: issued.rawSessionToken,
    sessionExpiresAt: issued.expiresAt,
  };
}

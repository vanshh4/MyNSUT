"use client";

import { Lock } from "lucide-react";

export function UnauthorizedAction() {
  return (
    <div className="flex items-center gap-2 p-3 text-sm text-gray-400 bg-white/5 rounded-lg border border-white/10">
      <Lock className="w-4 h-4 text-gray-500" />
      <span>You don't have permission to perform this action.</span>
    </div>
  );
}

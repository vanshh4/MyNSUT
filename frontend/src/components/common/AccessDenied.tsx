"use client";

import { motion } from "framer-motion";
import { ShieldX } from "lucide-react";
import Link from "next/link";

export function AccessDenied() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center"
    >
      <div className="p-4 mb-6 rounded-full bg-red-500/10 text-red-500">
        <ShieldX className="w-12 h-12" />
      </div>
      <h1 className="text-3xl font-bold mb-3 font-archivo text-white">Access Denied</h1>
      <p className="max-w-md text-gray-400 mb-8 font-manrope">
        You don't have the required permissions to view this page. If you believe this is a mistake, please contact support.
      </p>
      <Link 
        href="/dashboard"
        className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white transition-colors duration-200"
      >
        Return to Dashboard
      </Link>
    </motion.div>
  );
}

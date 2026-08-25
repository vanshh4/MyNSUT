"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/common/PageHeader";
import { SocietyCard } from "@/components/societies/SocietyCard";
import { societiesApi } from "@/lib/api/societies";
import { Society } from "@mynsut/shared";

export default function SocietiesDiscoveryPage() {
  const [societies, setSocieties] = useState<Society[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSocieties();
  }, []);

  const fetchSocieties = async () => {
    try {
      const res = await societiesApi.getSocieties();
      setSocieties((res as any).data || []);
    } catch (error) {
      console.error("Failed to load societies", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSocieties = societies.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.category.toLowerCase().includes(search.toLowerCase()) ||
    (s.description && s.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="w-full">
      <PageHeader
        eyebrow="Campus communities"
        title="Societies & clubs"
        description="Find the communities that make campus feel like yours."
      />
      
      <div className="relative mb-10 max-w-xl group">
        <Search className="absolute top-1/2 left-4 w-5 h-5 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" />
        <input 
          className="w-full bg-glass-surface dark:bg-[#1a2b4b]/30 border border-glass-border rounded-full h-14 pl-12 pr-4 font-body text-base text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm" 
          placeholder="Search societies by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="text-lg text-text-muted">Loading societies...</div>
        </div>
      ) : (

      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {filteredSocieties.map((society, i) => (
          <motion.div
            key={society.id}
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="h-full"
          >
            <SocietyCard society={society} index={i} />
          </motion.div>
        ))}
        {filteredSocieties.length === 0 && (
          <div className="col-span-full py-12 text-center text-text-muted">
            No societies found matching your search.
          </div>
        )}
      </motion.div>
      )}
    </div>
  );
}

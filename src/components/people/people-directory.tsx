"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ProfileCard } from "./profile-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";
import type { Profile } from "@/lib/types";

const PAGE_SIZE = 24;

type Filters = {
  search: string;
  year: string;
  location: string;
  skill: string;
  mentorship: boolean;
};

const DEFAULT_FILTERS: Filters = {
  search: "",
  year: "",
  location: "",
  skill: "",
  mentorship: false,
};

function buildQuery(
  supabase: ReturnType<typeof createClient>,
  filters: Filters,
  cursor?: string
) {
  let q = supabase
    .from("profiles")
    .select("*")
    .eq("is_active", true)
    .order("updated_at", { ascending: false })
    .limit(PAGE_SIZE);

  if (filters.search.trim()) {
    const term = `%${filters.search.trim()}%`;
    q = q.or(`name.ilike.${term},role.ilike.${term},company.ilike.${term}`);
  }
  if (filters.year) q = q.eq("graduation_year", Number(filters.year));
  if (filters.location) q = q.eq("location", filters.location);
  if (filters.skill) q = q.contains("skills", [filters.skill]);
  if (filters.mentorship) q = q.eq("is_mentorship_open", true);
  if (cursor) q = q.lt("updated_at", cursor);

  return q;
}

export function PeopleDirectory({
  initialProfiles,
  initialHasMore,
  graduationYears,
  locations,
  skills,
}: {
  initialProfiles: Profile[];
  initialHasMore: boolean;
  graduationYears: number[];
  locations: string[];
  skills: string[];
}) {
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [committed, setCommitted] = useState<Filters>(DEFAULT_FILTERS);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const supabase = createClient();

  const fetchProfiles = useCallback(
    async (f: Filters, cursor?: string) => {
      setLoading(true);
      const { data } = await buildQuery(supabase, f, cursor);
      const rows = (data ?? []) as Profile[];
      if (cursor) {
        setProfiles((prev) => [...prev, ...rows]);
      } else {
        setProfiles(rows);
      }
      setHasMore(rows.length === PAGE_SIZE);
      setLoading(false);
    },
    [supabase]
  );

  // Debounce search field; instant-apply for all other filters.
  const handleSearchChange = (value: string) => {
    setFilters((f) => ({ ...f, search: value }));
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const next = { ...committed, search: value };
      setCommitted(next);
      fetchProfiles(next);
    }, 350);
  };

  const handleFilterChange = (key: keyof Omit<Filters, "search">, value: string | boolean) => {
    const next = { ...committed, [key]: value };
    setFilters(next);
    setCommitted(next);
    fetchProfiles(next);
  };

  const clearFilters = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setFilters(DEFAULT_FILTERS);
    setCommitted(DEFAULT_FILTERS);
    fetchProfiles(DEFAULT_FILTERS);
  };

  const loadMore = () => {
    const cursor = profiles[profiles.length - 1]?.updated_at;
    if (cursor) fetchProfiles(committed, cursor);
  };

  const activeFilterCount = [
    committed.search,
    committed.year,
    committed.location,
    committed.skill,
    committed.mentorship,
  ].filter(Boolean).length;

  return (
    <div>
      {/* Page header */}
      <section className="border-b border-border px-6 py-16 text-center">
        <p className="text-sm tracking-widest uppercase text-muted-foreground mb-4">
          CMU MHCI Alumni Directory
        </p>
        <h1 className="font-heading text-5xl md:text-7xl leading-none tracking-tight text-foreground">
          People
        </h1>
      </section>

      {/* Filters */}
      <div className="sticky top-14 z-40 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap gap-2 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search by name, role, or company…"
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Year */}
          <select
            value={filters.year}
            onChange={(e) => handleFilterChange("year", e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            aria-label="Filter by graduation year"
          >
            <option value="">All years</option>
            {graduationYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          {/* Location */}
          {locations.length > 0 && (
            <select
              value={filters.location}
              onChange={(e) => handleFilterChange("location", e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              aria-label="Filter by location"
            >
              <option value="">All locations</option>
              {locations.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          )}

          {/* Skill */}
          {skills.length > 0 && (
            <select
              value={filters.skill}
              onChange={(e) => handleFilterChange("skill", e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              aria-label="Filter by skill"
            >
              <option value="">All skills</option>
              {skills.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          )}

          {/* Mentorship toggle */}
          <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filters.mentorship}
              onChange={(e) => handleFilterChange("mentorship", e.target.checked)}
              className="h-4 w-4 rounded border-input accent-primary"
            />
            Open to mentorship
          </label>

          {/* Clear */}
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              Clear
              <Badge variant="secondary" className="text-xs ml-0.5">
                {activeFilterCount}
              </Badge>
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {profiles.length === 0 && !loading ? (
          <div className="text-center py-20">
            <p className="font-heading text-2xl text-foreground mb-2">No alumni found</p>
            <p className="text-muted-foreground">
              {activeFilterCount > 0
                ? "Try adjusting or clearing your filters."
                : "No profiles have been created yet."}
            </p>
            {activeFilterCount > 0 && (
              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {profiles.map((p) => (
                <ProfileCard key={p.id} profile={p} />
              ))}
            </div>

            {/* Load more */}
            {hasMore && (
              <div className="mt-10 flex justify-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={loadMore}
                  disabled={loading}
                >
                  {loading ? "Loading…" : "Load more"}
                </Button>
              </div>
            )}

            {loading && profiles.length === 0 && (
              <p className="text-center text-muted-foreground py-10">Loading…</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

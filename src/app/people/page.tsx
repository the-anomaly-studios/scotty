import { Nav } from "@/components/nav";
import { PeopleDirectory } from "@/components/people/people-directory";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

export const metadata = {
  title: "People · CMU MHCI Alumni Directory",
};

const PAGE_SIZE = 24;

export default async function PeoplePage() {
  const supabase = await createClient();

  const [{ data: profiles }, { data: allMeta }] = await Promise.all([
    supabase
      .from("profiles")
      .select("*")
      .eq("is_active", true)
      .order("updated_at", { ascending: false })
      .limit(PAGE_SIZE),
    supabase
      .from("profiles")
      .select("graduation_year, location, skills")
      .eq("is_active", true),
  ]);

  const meta = allMeta ?? [];

  const graduationYears = [
    ...new Set(
      meta
        .map((p) => p.graduation_year as number | null)
        .filter((y): y is number => y !== null)
    ),
  ].sort((a, b) => b - a);

  const locations = [
    ...new Set(
      meta
        .map((p) => p.location as string | null)
        .filter((l): l is string => Boolean(l))
    ),
  ].sort();

  const skills = [
    ...new Set(meta.flatMap((p) => (p.skills as string[]) ?? [])),
  ].sort();

  return (
    <>
      <Nav />
      <main className="flex-1 pt-14">
        <PeopleDirectory
          initialProfiles={(profiles ?? []) as Profile[]}
          initialHasMore={(profiles?.length ?? 0) === PAGE_SIZE}
          graduationYears={graduationYears}
          locations={locations}
          skills={skills}
        />
      </main>
    </>
  );
}

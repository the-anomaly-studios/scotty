import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Profile } from "@/lib/types";

export function ProfileCard({ profile: p }: { profile: Profile }) {
  const displayName = p.name ?? "MHCI Alumni";

  return (
    <Link
      href={`/people/${p.id}`}
      className="group flex flex-col gap-4 rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
    >
      {/* Avatar + name row */}
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-muted border border-border">
          {p.headshot_url ? (
            <Image
              src={p.headshot_url}
              alt={displayName}
              fill
              className="object-cover"
              sizes="48px"
            />
          ) : (
            <span className="flex h-full items-center justify-center font-heading text-xl text-muted-foreground">
              {displayName[0]?.toUpperCase()}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <p className="font-heading text-lg leading-tight truncate group-hover:text-primary transition-colors">
            {displayName}
          </p>
          {p.graduation_year && (
            <p className="text-xs text-muted-foreground">MHCI {p.graduation_year}</p>
          )}
        </div>
      </div>

      {/* Role / company */}
      {(p.role || p.company) && (
        <p className="text-sm text-muted-foreground truncate">
          {[p.role, p.company].filter(Boolean).join(" · ")}
        </p>
      )}

      {/* Location */}
      {p.location && (
        <p className="text-xs text-muted-foreground -mt-2">{p.location}</p>
      )}

      {/* Skills + mentorship badges */}
      {(p.skills.length > 0 || p.is_mentorship_open) && (
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {p.is_mentorship_open && (
            <Badge variant="secondary" className="text-xs">
              Open to mentorship
            </Badge>
          )}
          {p.skills.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="outline" className="text-xs">
              {skill}
            </Badge>
          ))}
          {p.skills.length > 3 && (
            <Badge variant="outline" className="text-xs text-muted-foreground">
              +{p.skills.length - 3}
            </Badge>
          )}
        </div>
      )}
    </Link>
  );
}

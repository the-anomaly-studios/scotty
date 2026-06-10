export function StatsBar({
  totalAlumni,
  uniqueCompanies,
  uniqueLocations,
}: {
  totalAlumni: number;
  uniqueCompanies: number;
  uniqueLocations: number;
}) {
  const stats = [
    { value: totalAlumni, label: "Alumni" },
    { value: uniqueCompanies, label: "Companies" },
    { value: uniqueLocations, label: "Countries & regions" },
  ];

  return (
    <section className="border-y border-border bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-3 divide-x divide-border">
        {stats.map(({ value, label }) => (
          <div key={label} className="text-center px-4 sm:px-8">
            <p className="font-heading text-4xl sm:text-5xl text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

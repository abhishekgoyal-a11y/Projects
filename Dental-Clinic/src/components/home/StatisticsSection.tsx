import { stats } from "@/data/homepage";

export function StatisticsSection() {
  return (
    <section className="border-b border-neutral-300 bg-neutral-50" aria-label="Practice statistics">
      <div className="mx-auto max-w-content px-5 py-10 md:px-8 lg:px-10">
        <ul className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {stats.map((stat) => (
            <li key={stat.label} className="text-center md:text-left">
              <p className="font-display text-3xl font-medium text-primary-900 md:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-neutral-700">{stat.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

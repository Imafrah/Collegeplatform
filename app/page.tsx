import HomeSearch from "@/components/HomeSearch";
import CollegeCard from "@/components/CollegeCard";
import { normalizeCollege } from "@/lib/colleges";
import { prisma } from "@/lib/prisma";
import type { College } from "@/types";

export const dynamic = "force-dynamic";

export default async function Home() {
  const featured = await prisma.college.findMany({
    orderBy: { rating: "desc" },
    take: 6,
  });

  return (
    <div>
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
            College Discovery Platform
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Find, compare, and save top Indian colleges by fees, placements, courses, ratings,
            type, and state.
          </p>
          <div className="mx-auto mt-8 max-w-2xl">
            <HomeSearch />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Featured colleges</h2>
            <p className="mt-1 text-slate-600">Top-rated institutions from the database.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((college) => (
            <CollegeCard key={college.id} college={normalizeCollege(college) as College} />
          ))}
        </div>
      </section>
    </div>
  );
}

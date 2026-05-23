import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import CollegeCard from "@/components/CollegeCard";
import { authOptions } from "@/lib/auth";
import { normalizeCollege } from "@/lib/colleges";
import { prisma } from "@/lib/prisma";
import type { College } from "@/types";

export const dynamic = "force-dynamic";

export default async function SavedPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const saved = await prisma.savedCollege.findMany({
    where: { userId: session.user.id },
    include: { college: true },
    orderBy: { id: "desc" },
  });
  const savedComparisons = await prisma.savedComparison.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Saved colleges</h1>
        <p className="mt-1 text-slate-600">Your bookmarked institutions and comparisons.</p>
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Colleges</h2>
          <Link href="/colleges" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            Browse colleges
          </Link>
        </div>
        {saved.length ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {saved.map((item) => (
            <CollegeCard
              key={item.id}
              college={normalizeCollege(item.college) as College}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">No saved colleges yet</h2>
          <p className="mt-2 text-slate-600">Start browsing and bookmark colleges you like.</p>
          <Link href="/colleges" className="mt-5 inline-block rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white">
            Browse colleges
          </Link>
        </div>
      )}
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Comparisons</h2>
          <Link href="/compare" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            Compare colleges
          </Link>
        </div>
        {savedComparisons.length ? (
          <div className="grid gap-3 md:grid-cols-2">
            {savedComparisons.map((comparison) => (
              <Link
                key={comparison.id}
                href={`/compare?${comparison.collegeIds.map((id) => `ids=${encodeURIComponent(id)}`).join("&")}`}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-200 hover:bg-blue-50/30"
              >
                <h3 className="font-semibold text-slate-900">{comparison.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{comparison.collegeIds.length} colleges compared</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h3 className="font-semibold text-slate-900">No saved comparisons yet</h3>
            <p className="mt-2 text-slate-600">Save a comparison after selecting 2 to 3 colleges.</p>
          </div>
        )}
      </section>
    </div>
  );
}

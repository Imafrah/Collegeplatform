"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import CompareTable from "@/components/CompareTable";
import SaveComparisonButton from "@/components/SaveComparisonButton";
import type { College } from "@/types";

export default function ComparePageClient({
  colleges,
  initialSaved,
}: {
  colleges: College[];
  initialSaved: boolean;
}) {
  const router = useRouter();

  function removeCollege(id: string) {
    const next = colleges.filter((college) => college.id !== id);
    const params = next.map((college) => `ids=${encodeURIComponent(college.id)}`).join("&");
    router.push(params ? `/compare?${params}` : "/compare");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Compare colleges</h1>
          <p className="mt-1 text-slate-600">Compare fees, rating, placements, and recruiters.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <SaveComparisonButton colleges={colleges} initialSaved={initialSaved} />
          {colleges.length === 2 ? (
            <Link
              href={`/colleges?${colleges.map((college) => `ids=${encodeURIComponent(college.id)}`).join("&")}`}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Add another college
            </Link>
          ) : null}
        </div>
      </div>
      <CompareTable colleges={colleges} onRemove={removeCollege} />
    </div>
  );
}

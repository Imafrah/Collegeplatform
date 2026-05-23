"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import CollegeCard from "@/components/CollegeCard";
import FilterPanel from "@/components/FilterPanel";
import SearchBar from "@/components/SearchBar";
import type { College } from "@/types";

type Props = {
  colleges: College[];
  total: number;
  pages: number;
  currentPage: number;
  q: string;
  state: string;
  type: string;
  selectedIds: string[];
};

export default function CollegeListing({
  colleges,
  total,
  pages,
  currentPage,
  q,
  state,
  type,
  selectedIds,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateParams(updates: Record<string, string | string[]>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      params.delete(key);
      if (Array.isArray(value)) {
        value.forEach((item) => params.append(key, item));
      } else if (value) {
        params.set(key, value);
      }
    });
    router.push(`/colleges?${params.toString()}`);
  }

  function toggleCompare(id: string) {
    const exists = selectedIds.includes(id);
    const next = exists ? selectedIds.filter((item) => item !== id) : [...selectedIds, id].slice(0, 3);
    updateParams({ ids: next });
  }

  const compareHref = `/compare?${selectedIds.map((id) => `ids=${encodeURIComponent(id)}`).join("&")}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <SearchBar
          defaultValue={q}
          onSearch={(value) => updateParams({ q: value, page: "1" })}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <FilterPanel
          currentState={state}
          currentType={type}
          onChange={(filters) => updateParams({ ...filters, page: "1" })}
        />

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900">Colleges</h1>
            <p className="text-sm text-slate-600">{total} results</p>
          </div>

          {colleges.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {colleges.map((college) => (
                <CollegeCard
                  key={college.id}
                  college={college}
                  showCompareCheckbox
                  isCompareSelected={selectedIds.includes(college.id)}
                  onCompareToggle={toggleCompare}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">No colleges found</h2>
              <p className="mt-2 text-slate-600">Try changing the search term or filters.</p>
            </div>
          )}

          {pages > 1 ? (
            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => updateParams({ page: String(currentPage - 1) })}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-slate-600">
                Page {currentPage} of {pages}
              </span>
              <button
                type="button"
                disabled={currentPage >= pages}
                onClick={() => updateParams({ page: String(currentPage + 1) })}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          ) : null}
        </section>
      </div>

      {selectedIds.length >= 2 && selectedIds.length <= 3 ? (
        <Link
          href={compareHref}
          className="fixed bottom-6 left-1/2 z-30 -translate-x-1/2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg hover:bg-blue-700"
        >
          Compare Now
        </Link>
      ) : null}
    </div>
  );
}


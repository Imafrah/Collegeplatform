"use client";

import Link from "next/link";
import { formatFees } from "@/lib/colleges";
import type { College } from "@/types";

type Props = {
  college: College;
  showCompareCheckbox?: boolean;
  isCompareSelected?: boolean;
  onCompareToggle?: (collegeId: string) => void;
};

export default function CollegeCard({
  college,
  showCompareCheckbox = false,
  isCompareSelected = false,
  onCompareToggle,
}: Props) {
  return (
    <div className="group relative rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md">
      {showCompareCheckbox ? (
        <label className="absolute right-4 top-4 z-10 flex items-center gap-2 rounded-lg bg-white/95 px-2 py-1 text-xs font-medium text-slate-700 shadow-sm">
          <input
            type="checkbox"
            checked={isCompareSelected}
            onChange={() => onCompareToggle?.(college.id)}
            onClick={(event) => event.stopPropagation()}
            className="h-4 w-4 accent-blue-600"
          />
          Compare
        </label>
      ) : null}

      <Link href={`/colleges/${college.id}`} className="block">
        <div className="pr-24">
          <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600">
            {college.name}
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            {college.location}, {college.state}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
            {college.type}
          </span>
          <span className="text-sm font-medium text-amber-600">
            {"★".repeat(Math.round(college.rating))}
            <span className="ml-1 text-slate-600">{college.rating.toFixed(1)}</span>
          </span>
        </div>

        <p className="mt-4 text-sm font-semibold text-slate-900">{formatFees(college.fees)}</p>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{college.overview}</p>
      </Link>
    </div>
  );
}


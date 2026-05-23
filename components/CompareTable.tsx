"use client";

import { formatFees } from "@/lib/colleges";
import type { College } from "@/types";

type Props = {
  colleges: College[];
  onRemove?: (collegeId: string) => void;
};

export default function CompareTable({ colleges, onRemove }: Props) {
  const lowestFees = Math.min(...colleges.map((college) => college.fees));
  const highestRating = Math.max(...colleges.map((college) => college.rating));
  const highestAvg = Math.max(...colleges.map((college) => college.placements.avgPackage));
  const highestPackage = Math.max(...colleges.map((college) => college.placements.highestPackage));

  const rows = [
    { label: "Location", render: (college: College) => college.location },
    { label: "State", render: (college: College) => college.state },
    { label: "Type", render: (college: College) => college.type },
    {
      label: "Annual Fees",
      render: (college: College) => formatFees(college.fees),
      best: (college: College) => college.fees === lowestFees,
    },
    {
      label: "Rating",
      render: (college: College) => `${college.rating.toFixed(1)} / 5`,
      best: (college: College) => college.rating === highestRating,
    },
    {
      label: "Avg Package",
      render: (college: College) => `₹${college.placements.avgPackage} LPA`,
      best: (college: College) => college.placements.avgPackage === highestAvg,
    },
    {
      label: "Highest Package",
      render: (college: College) => `₹${college.placements.highestPackage} LPA`,
      best: (college: College) => college.placements.highestPackage === highestPackage,
    },
    {
      label: "Top Recruiters",
      render: (college: College) => college.placements.topRecruiters.join(", "),
    },
  ];

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-[760px] w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="w-44 bg-slate-50 p-4 text-sm font-semibold text-slate-700">Feature</th>
            {colleges.map((college) => (
              <th key={college.id} className="p-4 align-top">
                <div className="flex items-start justify-between gap-3">
                  <span className="font-semibold text-slate-900">{college.name}</span>
                  {onRemove ? (
                    <button
                      type="button"
                      onClick={() => onRemove(college.id)}
                      className="rounded-lg px-2 py-1 text-sm font-medium text-red-500 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  ) : null}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-slate-100 last:border-0">
              <th className="bg-slate-50 p-4 text-sm font-semibold text-slate-700">{row.label}</th>
              {colleges.map((college) => {
                const isBest = "best" in row && row.best?.(college);
                return (
                  <td
                    key={college.id}
                    className={`p-4 text-sm ${isBest ? "font-semibold text-emerald-500" : "text-slate-700"}`}
                  >
                    {row.render(college)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


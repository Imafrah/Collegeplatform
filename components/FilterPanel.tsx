"use client";

import { states } from "@/lib/colleges";

type Filters = {
  state: string;
  type: string;
};

type Props = {
  currentState?: string;
  currentType?: string;
  onChange: (filters: Filters) => void;
};

export default function FilterPanel({ currentState = "", currentType = "", onChange }: Props) {
  return (
    <aside className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-slate-900">Filters</h2>
        <button
          type="button"
          onClick={() => onChange({ state: "", type: "" })}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Clear All
        </button>
      </div>

      <label className="block text-sm font-medium text-slate-700" htmlFor="state">
        State
      </label>
      <select
        id="state"
        value={currentState}
        onChange={(event) => onChange({ state: event.target.value, type: currentType })}
        className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
      >
        <option value="">All states</option>
        {states.map((state) => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
      </select>

      <div className="mt-6">
        <p className="text-sm font-medium text-slate-700">Type</p>
        {["", "Public", "Private"].map((type) => (
          <label key={type || "All"} className="mt-3 flex items-center gap-2 text-sm text-slate-700">
            <input
              type="radio"
              name="type"
              value={type}
              checked={currentType === type}
              onChange={() => onChange({ state: currentState, type })}
              className="h-4 w-4 accent-blue-600"
            />
            {type || "All"}
          </label>
        ))}
      </div>
    </aside>
  );
}


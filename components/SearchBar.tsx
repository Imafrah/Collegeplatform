"use client";

import { FormEvent, useState } from "react";

type Props = {
  defaultValue?: string;
  onSearch: (value: string) => void;
};

export default function SearchBar({ defaultValue = "", onSearch }: Props) {
  const [value, setValue] = useState(defaultValue);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch(value.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-2">
      <div className="relative flex-1">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          &#128269;
        </span>
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Search colleges by name"
          className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
        />
      </div>
      <button
        type="submit"
        className="h-12 rounded-xl bg-blue-600 px-5 font-semibold text-white hover:bg-blue-700"
      >
        Search
      </button>
    </form>
  );
}


"use client";

import { signIn, useSession } from "next-auth/react";
import { useState } from "react";

type Props = {
  collegeId: string;
  initialSaved: boolean;
};

export default function SaveButton({ collegeId, initialSaved }: Props) {
  const { status } = useSession();
  const [saved, setSaved] = useState(initialSaved);
  const [pending, setPending] = useState(false);

  async function toggleSaved() {
    if (status !== "authenticated") {
      signIn("google");
      return;
    }

    setPending(true);
    const previous = saved;
    setSaved(!saved);

    const response = await fetch("/api/saved", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collegeId }),
    });

    if (response.status === 401) {
      setSaved(previous);
      signIn("google");
      return;
    }

    if (!response.ok) {
      setSaved(previous);
      setPending(false);
      return;
    }

    const data = (await response.json()) as { saved: boolean };
    setSaved(data.saved);
    setPending(false);
  }

  return (
    <button
      type="button"
      onClick={toggleSaved}
      disabled={pending}
      className={`rounded-xl border px-4 py-2 text-sm font-semibold ${
        saved
          ? "border-blue-600 bg-blue-600 text-white hover:bg-blue-700"
          : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
      } disabled:opacity-60`}
    >
      {saved ? "Bookmark saved" : "Save college"}
    </button>
  );
}


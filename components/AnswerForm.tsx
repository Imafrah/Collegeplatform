"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function AnswerForm({ questionId }: { questionId: string }) {
  const router = useRouter();
  const { status } = useSession();
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submitAnswer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (status !== "authenticated") {
      signIn("google");
      return;
    }

    setPending(true);
    setError("");

    const response = await fetch(`/api/discussions/${questionId}/answers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });

    if (response.status === 401) {
      signIn("google");
      return;
    }

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? "Failed to post answer");
      setPending(false);
      return;
    }

    setBody("");
    setPending(false);
    router.refresh();
  }

  return (
    <form onSubmit={submitAnswer} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Add an answer</h2>
      <textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        placeholder="Share your answer"
        className="mt-4 min-h-28 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        maxLength={2000}
      />
      {error ? <p className="mt-3 text-sm text-red-500">{error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {pending ? "Posting..." : "Post answer"}
      </button>
    </form>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type DeleteDiscussionButtonProps = {
  endpoint: string;
  label?: string;
  redirectTo?: string;
};

export default function DeleteDiscussionButton({
  endpoint,
  label = "Delete",
  redirectTo,
}: DeleteDiscussionButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function deleteItem() {
    const confirmed = window.confirm("Delete this post? This cannot be undone.");

    if (!confirmed) {
      return;
    }

    setPending(true);
    setError("");

    const response = await fetch(endpoint, { method: "DELETE" });

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      setError(data.error ?? "Failed to delete");
      setPending(false);
      return;
    }

    if (redirectTo) {
      router.push(redirectTo);
      router.refresh();
      return;
    }

    setPending(false);
    router.refresh();
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={deleteItem}
        disabled={pending}
        className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
      >
        {pending ? "Deleting..." : label}
      </button>
      {error ? <span className="text-xs text-red-500">{error}</span> : null}
    </div>
  );
}

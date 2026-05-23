"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h2 className="text-xl font-semibold text-red-500">Failed to load colleges</h2>
      <button
        type="button"
        onClick={reset}
        className="mt-4 rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white"
      >
        Retry
      </button>
    </div>
  );
}


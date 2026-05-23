"use client";

import { useRouter } from "next/navigation";
import SearchBar from "@/components/SearchBar";

export default function HomeSearch() {
  const router = useRouter();

  return (
    <SearchBar
      onSearch={(value) => {
        const params = new URLSearchParams();
        if (value) params.set("q", value);
        router.push(`/colleges${params.toString() ? `?${params}` : ""}`);
      }}
    />
  );
}


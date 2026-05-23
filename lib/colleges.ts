import type { College } from "@/types";

export function formatFees(fees: number) {
  return `₹${(fees / 100000).toFixed(2)} L/year`;
}

export function normalizeCollege<T extends { placements: unknown }>(college: T) {
  return college as Omit<T, "placements"> & Pick<College, "placements">;
}

export const states = [
  "Delhi",
  "Gujarat",
  "Karnataka",
  "Maharashtra",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "West Bengal",
];


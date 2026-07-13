// ─── API Cache Tag Types ──────────────────────────────────────
// Centralized tag definitions for RTK Query cache invalidation.
// Import TAG_TYPES in baseApi, and use ApiTagType in domain slices.

export const TAG_TYPES = [
  'Job',
  'Jobs',
  'Application',
  'Applications',
  'Interview',
  'Interviews',
  'Profile',
  'User',
  'AIInterview',
  'SavedJobs',
] as const;

export type ApiTagType = (typeof TAG_TYPES)[number];

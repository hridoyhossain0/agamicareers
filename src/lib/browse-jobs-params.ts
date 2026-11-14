// URL <-> API contract for the public browse-jobs board.
//
// The URL is the single source of truth for the SearchBar filters: it makes a
// filtered board shareable, survives a refresh, and works with back/forward.
// `SearchBar` writes these params, `JobResults` reads them and turns them into
// the `GET /api/jobs` query string.

import { JOB_TYPES, type JobType } from "@/lib/types/jobs"

export const BROWSE_PARAM_KEYS = {
    q: "q",
    location: "location",
    type: "type",
    category: "category",
    remote: "remote",
    posted: "posted",
    salaryMin: "salaryMin",
    salaryMax: "salaryMax",
} as const

export type PostedWithin = "24h" | "week" | "month"

/** Everything the browse board can filter on. Empty values mean "no filter". */
export type BrowseFilters = {
    q: string
    location: string
    /** Multi-select: any `JobType` whose job matches is returned. */
    types: JobType[]
    category: string
    remoteOnly: boolean
    posted: PostedWithin | ""
    salaryMin: number | null
    salaryMax: number | null
}

export const EMPTY_BROWSE_FILTERS: BrowseFilters = {
    q: "",
    location: "",
    types: [],
    category: "",
    remoteOnly: false,
    posted: "",
    salaryMin: null,
    salaryMax: null,
}

/** Preset salary bands offered in the SearchBar (annualized by the API). */
export const SALARY_RANGES: { value: string; label: string; min: number | null; max: number | null }[] = [
    { value: "", label: "Any salary", min: null, max: null },
    { value: "under-30000", label: "Under 30,000", min: null, max: 30_000 },
    { value: "30000-60000", label: "30,000 – 60,000", min: 30_000, max: 60_000 },
    { value: "60000-100000", label: "60,000 – 100,000", min: 60_000, max: 100_000 },
    { value: "above-100000", label: "Above 100,000", min: 100_000, max: null },
]

const POSTED_VALUES: PostedWithin[] = ["24h", "week", "month"]

/** Minimal reader shared by `URLSearchParams` and `ReadonlyURLSearchParams`. */
type ParamsReader = { get: (name: string) => string | null }

function parseNumber(value: string | null): number | null {
    if (!value) return null
    const parsed = Number(value)
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : null
}

function parseTypes(value: string | null): JobType[] {
    if (!value) return []
    const types = value
        .split(",")
        .map((item) => item.trim())
        .filter((item): item is JobType => (JOB_TYPES as string[]).includes(item))
    // De-duplicate while keeping the user's order.
    return [...new Set(types)]
}

function parsePosted(value: string | null): PostedWithin | "" {
    return value && (POSTED_VALUES as string[]).includes(value) ? (value as PostedWithin) : ""
}

/** Read the board filters out of the current URL search params. */
export function parseBrowseFilters(params: ParamsReader): BrowseFilters {
    return {
        q: params.get(BROWSE_PARAM_KEYS.q)?.trim() ?? "",
        location: params.get(BROWSE_PARAM_KEYS.location)?.trim() ?? "",
        types: parseTypes(params.get(BROWSE_PARAM_KEYS.type)),
        category: params.get(BROWSE_PARAM_KEYS.category)?.trim() ?? "",
        remoteOnly: params.get(BROWSE_PARAM_KEYS.remote) === "1",
        posted: parsePosted(params.get(BROWSE_PARAM_KEYS.posted)),
        salaryMin: parseNumber(params.get(BROWSE_PARAM_KEYS.salaryMin)),
        salaryMax: parseNumber(params.get(BROWSE_PARAM_KEYS.salaryMax)),
    }
}

/**
 * Which salary preset matches the current min/max — used to keep the dropdown
 * in sync when the URL was opened directly (e.g. a shared link).
 */
export function salaryRangeValue(filters: Pick<BrowseFilters, "salaryMin" | "salaryMax">): string {
    return (
        SALARY_RANGES.find(
            (range) => range.min === filters.salaryMin && range.max === filters.salaryMax,
        )?.value ?? ""
    )
}

/** Serialize filters back into URL params, skipping empty values. */
export function buildBrowseSearchParams(filters: BrowseFilters): URLSearchParams {
    const params = new URLSearchParams()
    const q = filters.q.trim()
    const location = filters.location.trim()

    if (q) params.set(BROWSE_PARAM_KEYS.q, q)
    if (location) params.set(BROWSE_PARAM_KEYS.location, location)
    if (filters.types.length) params.set(BROWSE_PARAM_KEYS.type, filters.types.join(","))
    if (filters.category) params.set(BROWSE_PARAM_KEYS.category, filters.category)
    if (filters.remoteOnly) params.set(BROWSE_PARAM_KEYS.remote, "1")
    if (filters.posted) params.set(BROWSE_PARAM_KEYS.posted, filters.posted)
    if (filters.salaryMin !== null) params.set(BROWSE_PARAM_KEYS.salaryMin, String(filters.salaryMin))
    if (filters.salaryMax !== null) params.set(BROWSE_PARAM_KEYS.salaryMax, String(filters.salaryMax))

    return params
}

/** `GET /api/jobs?…` query string. The public board only ever shows live jobs. */
export function buildBrowseApiQuery(filters: BrowseFilters): string {
    const params = new URLSearchParams(buildBrowseSearchParams(filters))
    params.set("status", "active")
    return params.toString()
}

/** True when at least one filter is set (drives the empty-state copy + Clear button). */
export function hasBrowseFilters(filters: BrowseFilters): boolean {
    return (
        filters.q !== "" ||
        filters.location !== "" ||
        filters.types.length > 0 ||
        filters.category !== "" ||
        filters.remoteOnly ||
        filters.posted !== "" ||
        filters.salaryMin !== null ||
        filters.salaryMax !== null
    )
}

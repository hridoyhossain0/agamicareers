"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageContainer } from "@/componants/dashboardSidebar/pg_shall"
import { deleteJob, getJobs } from "@/lib/api/jobs"
import { JOB_CATEGORIES, type JobRow, type JobStatus } from "@/lib/types/jobs"
import { cn } from "@/lib/utils"
import {
    AlertTriangle,
    Briefcase,
    CheckCircle2,
    Clock,
    Eye,
    Plus,
    Search,
    Trash2,
    TrendingUp,
    Users,
    X,
} from "lucide-react"

/** Tab/select status filter — "all" mirrors the mockup's "All Statuses". */
type StatusFilter = "all" | JobStatus

type Banner = { kind: "success" | "error"; text: string }

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
    { value: "all", label: "All Statuses" },
    { value: "active", label: "Active" },
    { value: "expired", label: "Closed" },
]

const CATEGORY_OPTIONS: { value: string; label: string }[] = [
    { value: "all", label: "All Categories" },
    ...JOB_CATEGORIES.map((category) => ({ value: category, label: category })),
]

const TABLE_COLUMNS = ["Title", "Company", "Category", "Type", "Date Posted", "Status"] as const

/** Ref shown under each title, derived from the job id (mockup shows "HL-…"). */
const refOf = (job: JobRow) => `HL-${job._id.slice(-5).toUpperCase()}`

/** "full-time" → "Full-time", "contract" → "Contract". */
const typeLabel = (jobType: string) => jobType.charAt(0).toUpperCase() + jobType.slice(1)

/** ISO / date-only strings → "Nov 12, 2026"; anything else passes through. */
function formatDate(value?: string | null): string {
    if (!value) return "—"
    const dateOnly = /^(\d{4})-(\d{2})-(\d{2})/.exec(value)
    const date = dateOnly
        ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))
        : new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

/** "Date Posted" cell: absolute date when the API stamped one, else its relative label. */
const postedOn = (job: JobRow) =>
    job.createdAt && !Number.isNaN(Date.parse(job.createdAt)) ? formatDate(job.createdAt) : job.posted || "—"

/** Whole days since an ISO timestamp; null when the stamp is missing/invalid. */
function daysSince(iso?: string | null): number | null {
    if (!iso) return null
    const time = Date.parse(iso)
    if (Number.isNaN(time)) return null
    return Math.max(0, Math.floor((Date.now() - time) / 86_400_000))
}

function StatusPill({ status }: { status: JobStatus }) {
    const isActive = status === "active"
    return (
        <span
            className={cn(
                "inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium",
                isActive
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    : "border-neutral-700 bg-neutral-800 text-neutral-400",
            )}
        >
            {isActive ? "Active" : "Closed"}
        </span>
    )
}

/** Label/value pair used inside the job details dialog. */
function Detail({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div>
            <dt className="text-xs font-medium tracking-wider text-neutral-500 uppercase">{label}</dt>
            <dd className="mt-1 text-sm text-neutral-200">{children}</dd>
        </div>
    )
}

export default function ManageJobsPage() {
    const [jobs, setJobs] = useState<JobRow[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [banner, setBanner] = useState<Banner | null>(null)

    const [query, setQuery] = useState("")
    const [status, setStatus] = useState<StatusFilter>("all")
    const [category, setCategory] = useState("all")

    const [viewJob, setViewJob] = useState<JobRow | null>(null)
    const [jobToDelete, setJobToDelete] = useState<JobRow | null>(null)
    const [deleting, setDeleting] = useState(false)

    // No setState before the first `await`: on mount `loading`/`error` already
    // hold their initial values, and retries reset them in the click handler.
    const loadJobs = useCallback(async () => {
        try {
            setJobs(await getJobs())
            setError(null)
        } catch (err) {
            console.error("getJobs failed:", err)
            setError("We couldn't load your jobs. Check that the jobs API is running, then try again.")
        } finally {
            setLoading(false)
        }
    }, [])

    // Initial load. The microtask hop is not about timing — `loadJobs` only
    // touches state after the fetch resolves — but `react-hooks/set-state-in-effect`
    // flags any setState-calling function invoked directly from an effect, so
    // the indirection runs it outside the effect body.
    useEffect(() => {
        void Promise.resolve().then(loadJobs)
    }, [loadJobs])

    const retry = () => {
        setLoading(true)
        setError(null)
        void loadJobs()
    }

    // Feedback banners dismiss themselves after a few seconds.
    useEffect(() => {
        if (!banner) return
        const timer = setTimeout(() => setBanner(null), 6000)
        return () => clearTimeout(timer)
    }, [banner])

    const term = query.trim().toLowerCase()

    // Search + category narrow the result set; the status select/tabs then
    // pick a slice of it (status never affects the counts or the stat cards).
    const filtered = useMemo(
        () =>
            jobs.filter((job) => {
                const matchesTerm =
                    !term ||
                    job.title.toLowerCase().includes(term) ||
                    job.companyName.toLowerCase().includes(term)
                const matchesCategory = category === "all" || job.category === category
                return matchesTerm && matchesCategory
            }),
        [jobs, term, category],
    )

    const rows = useMemo(
        () => (status === "all" ? filtered : filtered.filter((job) => job.status === status)),
        [filtered, status],
    )

    const activeCount = filtered.filter((job) => job.status === "active").length
    const closedCount = filtered.length - activeCount

    // Stat cards — every number below is computed from the fetched jobs.
    const stats = useMemo(() => {
        const total = filtered.length
        const rate = total === 0 ? 0 : Number(((activeCount / total) * 100).toFixed(1))
        const activeAges = filtered
            .filter((job) => job.status === "active")
            .map((job) => daysSince(job.createdAt))
            .filter((days): days is number => days !== null)
        const avgDays =
            activeAges.length === 0
                ? null
                : Math.round(activeAges.reduce((sum, days) => sum + days, 0) / activeAges.length)
        const applications = filtered.reduce((sum, job) => sum + (Number(job.applicants) || 0), 0)

        return [
            {
                label: "Active Rate",
                value: `${rate}%`,
                hint: total === 0 ? "No listings yet" : `${activeCount} of ${total} listings live`,
                icon: TrendingUp,
            },
            {
                label: "Avg. Days Open",
                value: avgDays === null ? "—" : `${avgDays} ${avgDays === 1 ? "Day" : "Days"}`,
                hint:
                    activeAges.length === 0
                        ? "No active listings"
                        : `across ${activeAges.length} active listing${activeAges.length === 1 ? "" : "s"}`,
                icon: Clock,
            },
            {
                label: "Total Applications",
                value: String(applications),
                hint: `across ${total} listing${total === 1 ? "" : "s"}`,
                icon: Users,
            },
        ]
    }, [filtered, activeCount])

    const hasFilters = query.trim() !== "" || status !== "all" || category !== "all"

    const clearFilters = () => {
        setQuery("")
        setStatus("all")
        setCategory("all")
    }

    const confirmDelete = async () => {
        if (!jobToDelete) return
        setDeleting(true)
        try {
            await deleteJob(jobToDelete._id)
            setJobs((prev) => prev.filter((job) => job._id !== jobToDelete._id))
            setBanner({ kind: "success", text: `${jobToDelete.title} was deleted.` })
        } catch (err) {
            console.error("deleteJob failed:", err)
            setBanner({ kind: "error", text: "We couldn't delete this job. Please try again." })
        } finally {
            setDeleting(false)
            setJobToDelete(null)
        }
    }

    const tabs: { value: StatusFilter; label: string; count: number }[] = [
        { value: "active", label: "Active", count: activeCount },
        { value: "expired", label: "Closed", count: closedCount },
    ]

    return (
        <PageContainer width="wide">
            {banner && (
                <div
                    role="status"
                    className={cn(
                        "mb-6 flex items-start gap-3 rounded-lg border px-4 py-3 text-sm",
                        banner.kind === "success"
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                            : "border-red-500/30 bg-red-500/10 text-red-200",
                    )}
                >
                    {banner.kind === "success" ? (
                        <CheckCircle2 aria-hidden className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                    ) : (
                        <AlertTriangle aria-hidden className="mt-0.5 size-4 shrink-0 text-red-400" />
                    )}
                    <p className="flex-1">{banner.text}</p>
                    <button
                        type="button"
                        onClick={() => setBanner(null)}
                        aria-label="Dismiss message"
                        className="shrink-0 rounded p-0.5 opacity-70 transition hover:opacity-100"
                    >
                        <X aria-hidden className="size-4" />
                    </button>
                </div>
            )}

            {/* Page header */}
            <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Manage Jobs</h1>
                    <p className="mt-1.5 text-sm text-neutral-400">
                        View and manage all job listings posted across the platform.
                    </p>
                </div>
                <Button
                    render={<Link href="/dashboard/recruiter/jobs/new" />}
                    nativeButton={false}
                    className="h-10 shrink-0 gap-2 bg-white px-4 text-sm font-semibold text-neutral-900 shadow-sm hover:bg-neutral-200"
                >
                    <Plus aria-hidden />
                    Create Job
                </Button>
            </header>

            {/* Toolbar: search + status + category. Stacked below lg because the
                sidebar leaves only ~480px of content at md — not enough for a
                full row of search + two fixed-width selects. */}
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center">
                <div className="relative w-full lg:flex-1">
                    <Search
                        aria-hidden
                        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-500"
                    />
                    <Input
                        type="text"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search by title or company…"
                        aria-label="Search jobs"
                        className="h-10 w-full border-neutral-700 bg-neutral-900/60 pr-9 pl-9 text-sm text-white placeholder:text-neutral-500 focus-visible:border-neutral-500 focus-visible:ring-neutral-500/30"
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={() => setQuery("")}
                            aria-label="Clear search"
                            className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 text-neutral-500 transition hover:text-white"
                        >
                            <X aria-hidden className="size-3.5" />
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-3 lg:flex">
                    <Select
                        value={status}
                        onValueChange={(value) => setStatus(value as StatusFilter)}
                        items={STATUS_OPTIONS}
                    >
                        <SelectTrigger
                            aria-label="Filter by status"
                            className="h-10 w-full justify-between gap-2 border-neutral-700 bg-neutral-900/60 pr-3 pl-3 font-medium text-neutral-200 hover:border-neutral-600 data-[size=default]:h-10 lg:w-40 [&_svg]:text-neutral-500"
                        >
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-neutral-900 text-neutral-200 ring-neutral-700">
                            {STATUS_OPTIONS.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                    className="focus:bg-neutral-800 focus:text-white"
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={category}
                        onValueChange={(value) => setCategory(value ?? "all")}
                        items={CATEGORY_OPTIONS}
                    >
                        <SelectTrigger
                            aria-label="Filter by category"
                            className="h-10 w-full justify-between gap-2 border-neutral-700 bg-neutral-900/60 pr-3 pl-3 font-medium text-neutral-200 hover:border-neutral-600 data-[size=default]:h-10 lg:w-52 [&_svg]:text-neutral-500"
                        >
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-neutral-900 text-neutral-200 ring-neutral-700">
                            {CATEGORY_OPTIONS.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                    className="focus:bg-neutral-800 focus:text-white"
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Listings card: tabs + table (desktop) / cards (mobile) */}
            <section className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/40">
                {!loading && !error && (
                    <div className="flex items-center gap-6 border-b border-neutral-800 px-4 sm:px-6">
                        {tabs.map((tab) => {
                            const selected = status === tab.value
                            return (
                                <button
                                    key={tab.value}
                                    type="button"
                                    // Clicking the selected tab again clears the status filter.
                                    onClick={() => setStatus(selected ? "all" : tab.value)}
                                    aria-pressed={selected}
                                    className={cn(
                                        "relative py-3.5 text-sm font-medium transition-colors outline-none",
                                        selected ? "text-white" : "text-neutral-500 hover:text-neutral-300",
                                    )}
                                >
                                    {tab.label} ({tab.count})
                                    {selected && (
                                        <span
                                            aria-hidden
                                            className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-white"
                                        />
                                    )}
                                </button>
                            )
                        })}
                    </div>
                )}

                {loading ? (
                    <div role="status" className="flex flex-col gap-5 px-4 py-6 sm:px-6">
                        <span className="sr-only">Loading jobs…</span>
                        {Array.from({ length: 5 }, (_, index) => (
                            <div key={index} className="flex animate-pulse items-center gap-4">
                                <div className="h-4 w-40 rounded bg-neutral-800/60" />
                                <div className="hidden h-4 flex-1 rounded bg-neutral-800/60 sm:block" />
                                <div className="hidden h-4 w-24 rounded bg-neutral-800/60 md:block" />
                                <div className="h-6 w-16 rounded-full bg-neutral-800/60" />
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center px-6 py-14 text-center">
                        <AlertTriangle aria-hidden className="size-6 text-amber-400" />
                        <h2 className="mt-4 text-sm font-semibold text-white">Couldn’t load jobs</h2>
                        <p className="mt-1.5 max-w-md text-sm text-neutral-500">{error}</p>
                        <Button
                            onClick={retry}
                            className="mt-5 h-9 bg-white px-4 font-semibold text-neutral-900 hover:bg-neutral-200"
                        >
                            Retry
                        </Button>
                    </div>
                ) : rows.length === 0 ? (
                    <div className="flex flex-col items-center px-6 py-14 text-center">
                        <span className="flex size-11 items-center justify-center rounded-full border border-neutral-800 bg-neutral-800/60 text-neutral-400">
                            <Briefcase aria-hidden className="size-5" />
                        </span>
                        <h2 className="mt-4 text-sm font-semibold text-white">
                            {jobs.length === 0
                                ? "No jobs yet"
                                : filtered.length === 0
                                    ? "No jobs match your filters"
                                    : `No ${status === "active" ? "active" : "closed"} jobs`}
                        </h2>
                        <p className="mt-1.5 max-w-sm text-sm text-neutral-500">
                            {jobs.length === 0
                                ? "Create your first job listing and it will show up here for you to manage."
                                : filtered.length === 0
                                    ? "Try a different search term or clear the filters to see all listings."
                                    : "None of the current results have this status."}
                        </p>
                        {jobs.length === 0 ? (
                            <Button
                                render={<Link href="/dashboard/recruiter/jobs/new" />}
                                nativeButton={false}
                                className="mt-5 h-9 gap-2 bg-white px-4 font-semibold text-neutral-900 hover:bg-neutral-200"
                            >
                                <Plus aria-hidden />
                                Create Job
                            </Button>
                        ) : hasFilters ? (
                            <Button
                                onClick={clearFilters}
                                className="mt-5 h-9 border-neutral-700 bg-neutral-800 px-4 text-neutral-200 hover:bg-neutral-700"
                            >
                                Clear filters
                            </Button>
                        ) : (
                            <Button
                                onClick={() => setStatus("all")}
                                className="mt-5 h-9 border-neutral-700 bg-neutral-800 px-4 text-neutral-200 hover:bg-neutral-700"
                            >
                                Show all statuses
                            </Button>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Desktop table (lg+; smaller screens get cards below) */}
                        <div className="hidden overflow-x-auto lg:block">
                            <table className="w-full min-w-[680px] border-collapse text-left">
                                <caption className="sr-only">Job listings</caption>
                                <thead>
                                    <tr className="border-b border-neutral-800">
                                        {TABLE_COLUMNS.map((column) => (
                                            <th
                                                key={column}
                                                scope="col"
                                                className="px-3 py-3 text-xs font-semibold tracking-wider whitespace-nowrap text-neutral-500 uppercase first:pl-6"
                                            >
                                                {column}
                                            </th>
                                        ))}
                                        <th
                                            scope="col"
                                            className="px-3 py-3 pr-6 text-right text-xs font-semibold tracking-wider whitespace-nowrap text-neutral-500 uppercase"
                                        >
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((job) => (
                                        <tr
                                            key={job._id}
                                            className="border-b border-neutral-800/60 transition-colors last:border-b-0 hover:bg-neutral-800/40"
                                        >
                                            <td className="px-3 py-4 pl-6 align-top">
                                                <p className="text-sm leading-snug font-medium text-white">
                                                    {job.title}
                                                </p>
                                                <p className="mt-1 text-xs whitespace-nowrap text-neutral-500">Ref: {refOf(job)}</p>
                                            </td>
                                            <td className="px-3 py-4 align-top text-sm text-neutral-300">
                                                {job.companyName}
                                            </td>
                                            <td className="px-3 py-4 align-top text-sm text-neutral-400">
                                                {job.category}
                                            </td>
                                            <td className="px-3 py-4 align-top text-sm whitespace-nowrap text-neutral-300">
                                                {typeLabel(job.jobType)}
                                            </td>
                                            <td className="px-3 py-4 align-top text-sm whitespace-nowrap text-neutral-400">
                                                {postedOn(job)}
                                            </td>
                                            <td className="px-3 py-4 align-top">
                                                <StatusPill status={job.status} />
                                            </td>
                                            <td className="px-3 py-4 pr-6 align-top">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon-sm"
                                                        onClick={() => setViewJob(job)}
                                                        aria-label={`View ${job.title}`}
                                                        className="text-neutral-400 hover:bg-neutral-700 hover:text-white"
                                                    >
                                                        <Eye aria-hidden />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon-sm"
                                                        onClick={() => setJobToDelete(job)}
                                                        aria-label={`Delete ${job.title}`}
                                                        className="text-neutral-400 hover:bg-neutral-700 hover:text-red-400"
                                                    >
                                                        <Trash2 aria-hidden />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile / tablet cards (below lg) */}
                        <ul className="divide-y divide-neutral-800 lg:hidden">
                            {rows.map((job) => (
                                <li key={job._id} className="flex flex-col gap-3 p-4 sm:p-5">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-white">{job.title}</p>
                                            <p className="mt-1 text-xs text-neutral-500">Ref: {refOf(job)}</p>
                                        </div>
                                        <StatusPill status={job.status} />
                                    </div>
                                    <p className="text-sm text-neutral-300">{job.companyName}</p>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-400">
                                        <span>{job.category}</span>
                                        <span>{typeLabel(job.jobType)}</span>
                                        <span>{postedOn(job)}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => setViewJob(job)}
                                            className="h-8 flex-1 gap-1.5 border border-neutral-700 bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
                                        >
                                            <Eye aria-hidden />
                                            View
                                        </Button>
                                        <Button
                                            onClick={() => setJobToDelete(job)}
                                            className="h-8 flex-1 gap-1.5 border border-neutral-700 bg-neutral-800 text-neutral-200 hover:bg-neutral-700 hover:text-red-400"
                                        >
                                            <Trash2 aria-hidden />
                                            Delete
                                        </Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </section>

            {/* Stat cards — derived entirely from the fetched jobs */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {stats.map(({ label, value, hint, icon: Icon }) => (
                    <div key={label} className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <p className="text-sm text-neutral-400">{label}</p>
                                <p className="mt-2 text-2xl font-bold tracking-tight text-white">{value}</p>
                                <p className="mt-1 text-xs text-neutral-500">{hint}</p>
                            </div>
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-neutral-700 bg-neutral-800 text-neutral-300">
                                <Icon aria-hidden className="size-4" />
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Job details */}
            <Dialog
                open={viewJob !== null}
                onOpenChange={(open) => {
                    if (!open) setViewJob(null)
                }}
            >
                <DialogContent className="max-h-[85vh] overflow-hidden border border-neutral-800 bg-neutral-900 text-neutral-100 ring-neutral-700 sm:max-w-lg">
                    <DialogHeader className="pr-6">
                        <DialogTitle className="text-white">{viewJob?.title}</DialogTitle>
                        <DialogDescription className="text-neutral-400">
                            {viewJob ? `${viewJob.companyName} · Ref: ${refOf(viewJob)}` : ""}
                        </DialogDescription>
                    </DialogHeader>

                    {viewJob && (
                        <div className="-mr-2 max-h-[55vh] overflow-y-auto pr-2">
                            <div className="flex flex-wrap items-center gap-2">
                                <StatusPill status={viewJob.status} />
                                <span className="text-xs text-neutral-500">
                                    {viewJob.createdAt
                                        ? `Posted ${formatDate(viewJob.createdAt)}`
                                        : viewJob.posted}
                                </span>
                            </div>

                            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4">
                                <Detail label="Category">{viewJob.category}</Detail>
                                <Detail label="Job type">{typeLabel(viewJob.jobType)}</Detail>
                                <Detail label="Location">
                                    {viewJob.location || (viewJob.isRemote ? "Remote" : "—")}
                                    {viewJob.location && viewJob.isRemote ? " · Remote" : ""}
                                </Detail>
                                <Detail label="Salary">
                                    {viewJob.minSalary || viewJob.maxSalary
                                        ? `${viewJob.minSalary || "—"} – ${viewJob.maxSalary || "—"} ${viewJob.salaryFrequency}`
                                        : "—"}
                                </Detail>
                                <Detail label="Deadline">{formatDate(viewJob.deadline)}</Detail>
                                <Detail label="Applicants">{Number(viewJob.applicants) || 0}</Detail>
                            </dl>

                            {viewJob.responsibilities && (
                                <div className="mt-5">
                                    <h3 className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                                        Responsibilities
                                    </h3>
                                    <p className="mt-1.5 text-sm leading-relaxed whitespace-pre-line text-neutral-300">
                                        {viewJob.responsibilities}
                                    </p>
                                </div>
                            )}
                            {viewJob.requirements && (
                                <div className="mt-5">
                                    <h3 className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                                        Requirements
                                    </h3>
                                    <p className="mt-1.5 text-sm leading-relaxed whitespace-pre-line text-neutral-300">
                                        {viewJob.requirements}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    <DialogFooter className="border-neutral-800 bg-neutral-950">
                        <Button
                            onClick={() => setViewJob(null)}
                            className="h-9 border border-neutral-700 bg-neutral-800 px-4 text-neutral-200 hover:bg-neutral-700"
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete confirmation */}
            <Dialog
                open={jobToDelete !== null}
                onOpenChange={(open) => {
                    if (!open && !deleting) setJobToDelete(null)
                }}
            >
                <DialogContent className="border border-neutral-800 bg-neutral-900 text-neutral-100 ring-neutral-700 sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="text-white">Delete this job?</DialogTitle>
                        <DialogDescription className="text-neutral-400">
                            {jobToDelete
                                ? `${jobToDelete.title} (Ref: ${refOf(jobToDelete)}) will be permanently removed. This action cannot be undone.`
                                : ""}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="border-neutral-800 bg-neutral-950">
                        <Button
                            onClick={() => setJobToDelete(null)}
                            disabled={deleting}
                            className="h-9 border border-neutral-700 bg-neutral-800 px-4 text-neutral-200 hover:bg-neutral-700"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => void confirmDelete()}
                            disabled={deleting}
                            className="h-9 bg-red-600 px-4 text-white hover:bg-red-500"
                        >
                            {deleting ? "Deleting…" : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </PageContainer>
    )
}

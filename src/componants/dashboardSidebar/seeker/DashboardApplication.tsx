
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Code2,
  Palette,
  Database,
  Cloud,
  Bot,
  Download,
  ChevronLeft,
  ChevronRight,
  X,
  BriefcaseBusiness,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

type ApplicationStatus =
  | "Applied"
  | "Review"
  | "Shortlisted"
  | "Rejected"
  | "Offered";

const STATUSES: ApplicationStatus[] = [
  "Applied",
  "Review",
  "Shortlisted",
  "Rejected",
  "Offered",
];

/** One row of `GET /api/applications` (see `lib/server/applications-store.ts`). */
type ApiApplication = {
  _id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  createdAt: string;
  status?: string;
  archived?: boolean;
  job: {
    jobType?: string;
    location?: string;
    isRemote?: boolean;
    category?: string;
  } | null;
};

/** What the table renders — derived from the API row, never from fixtures. */
type Application = {
  id: string;
  title: string;
  company: string;
  type: string;
  location: string;
  applied: string;
  status: ApplicationStatus;
  icon: LucideIcon;
  archived: boolean;
};

/** Pick the row icon from the posting's category (falls back to a briefcase). */
function iconFor(category?: string): LucideIcon {
  const value = (category ?? "").toLowerCase();
  if (value.includes("design") || value.includes("ui") || value.includes("ux")) return Palette;
  if (value.includes("data")) return Database;
  if (value.includes("cloud") || value.includes("devops") || value.includes("infra")) return Cloud;
  if (value.includes("ai") || value.includes("machine") || value.includes("ml")) return Bot;
  if (value.includes("software") || value.includes("engineer") || value.includes("develop")) return Code2;
  return BriefcaseBusiness;
}

/** Stored statuses are free-form; anything unexpected reads as "Applied". */
function normalizeStatus(value?: string): ApplicationStatus {
  const match = STATUSES.find((status) => status.toLowerCase() === (value ?? "").toLowerCase());
  return match ?? "Applied";
}

/** "2 hours ago" from the application's real submission time. */
function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "Unknown";

  const minutes = Math.floor((Date.now() - then) / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
  }
  if (days < 365) {
    const months = Math.floor(days / 30);
    return `${months} month${months === 1 ? "" : "s"} ago`;
  }
  const years = Math.floor(days / 365);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

/** "full-time" → "Full-time" for the "type • location" line. */
function label(value?: string, fallback = "—"): string {
  if (!value) return fallback;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function toApplication(row: ApiApplication): Application {
  const job = row.job;
  return {
    id: row._id,
    title: row.jobTitle || job?.category || "Untitled role",
    company: row.companyName || "—",
    type: label(job?.jobType),
    location: job?.isRemote ? "Remote" : label(job?.location),
    applied: timeAgo(row.createdAt),
    status: normalizeStatus(row.status),
    icon: iconFor(job?.category),
    archived: row.archived === true,
  };
}

const statusStyles: Record<ApplicationStatus, string> = {
  Applied: "bg-zinc-700/40 text-zinc-300 border-zinc-600/30",
  Review: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  Shortlisted: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  Rejected: "bg-red-500/15 text-red-400 border-red-500/20",
  Offered: "bg-green-500/15 text-green-400 border-green-500/20",
};

export default function DashboardApplication() {
  const [activeTab, setActiveTab] = useState<
    "Active" | "Archived"
  >("Active");

  const [currentPage, setCurrentPage] = useState(1);

  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  // `GET /api/applications` is session-scoped, so it has to run in the browser
  // (the page itself stays static). The state updates all happen after `await`.
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response = await fetch("/api/applications", { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`GET /api/applications failed (${response.status})`);
        }
        const rows: ApiApplication[] = await response.json();
        if (cancelled) return;

        setApplications(rows.map(toApplication));
        setError(null);
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to load applications:", err);
        setError("Could not load your applications. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const retry = () => {
    setError(null);
    setLoading(true);
    setReloadKey((key) => key + 1);
  };

  const itemsPerPage = 5;

  const currentApplications = useMemo(
    () =>
      applications.filter((application) =>
        activeTab === "Archived" ? application.archived : !application.archived
      ),
    [applications, activeTab]
  );

  const totalPages = Math.ceil(
    currentApplications.length / itemsPerPage
  );

  const startIndex = (currentPage - 1) * itemsPerPage;

  const displayedApplications = currentApplications.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const stats = useMemo(() => {
    const total = applications.length;
    const shortlisted = applications.filter(
      (application) => application.status === "Shortlisted"
    ).length;
    const inReview = applications.filter(
      (application) => application.status === "Review"
    ).length;
    const offered = applications.filter(
      (application) => application.status === "Offered"
    ).length;

    return [
      {
        title: "Total Applied",
        value: loading ? "—" : String(total),
        color: "text-white",
      },
      {
        title: "Shortlisted",
        value: loading ? "—" : String(shortlisted),
        color: "text-white",
      },
      {
        title: "In Review",
        value: loading ? "—" : String(inReview),
        color: "text-amber-400",
      },
      {
        title: "Success Rate",
        value: loading
          ? "—"
          : `${total === 0 ? 0 : Math.round((offered / total) * 100)}%`,
        color: "text-green-500",
      },
    ];
  }, [applications, loading]);

  const handleTabChange = (tab: "Active" | "Archived") => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSelectedApplication(null);
  };

  const exportPDF = () => {
    window.print();
  };

  const changePage = (page: number) => {
    setCurrentPage(
      Math.max(1, Math.min(page, totalPages))
    );
  };

  const emptyMessage = loading
    ? "Loading your applications…"
    : error
      ? error
      : "No applications found.";

  return (
    <div className="min-h-screen bg-[#0c0c0f] text-white p-4 sm:p-6 lg:p-8">

      <div className="max-w-7xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div>
            <h1 className="text-xl sm:text-2xl font-semibold">
              My Applications
            </h1>

            <p className="text-sm text-zinc-400 mt-1">
              Track your job applications and interview progress in real-time.
            </p>
          </div>

          <div className="flex items-center gap-2 print:hidden">

            {/* Tabs */}
            <div className="flex items-center rounded-lg border border-[#29292f] bg-[#17171c] p-1">

              {(["Active", "Archived"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`px-4 py-2 rounded-md text-xs sm:text-sm transition ${
                    activeTab === tab
                      ? "bg-[#222228] text-white shadow"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}

            </div>

            {/* Export */}
            <button
              onClick={exportPDF}
              className="flex items-center gap-2 bg-white text-black rounded-lg px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium hover:bg-zinc-200 transition"
            >
              <Download size={15} />
              <span>Export PDF</span>
            </button>

          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

          {stats.map((stat) => (
            <div
              key={stat.title}
              className="bg-[#15151a] border border-[#26262d] rounded-xl p-4 sm:p-5"
            >
              <p className="text-xs sm:text-sm text-zinc-400">
                {stat.title}
              </p>

              <h2
                className={`text-2xl font-semibold mt-1 ${stat.color}`}
              >
                {stat.value}
              </h2>
            </div>
          ))}

        </div>

        {/* Load error */}
        {error && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 print:hidden">
            <p className="text-sm text-red-300">{error}</p>
            <button
              onClick={retry}
              className="self-start sm:self-auto rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-200 hover:bg-red-500/15 transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* Applications Table */}
        <div className="bg-[#15151a] border border-[#26262d] rounded-xl overflow-hidden">

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">

            <table className="w-full text-left">

              <thead className="border-b border-[#29292f] text-xs text-zinc-400">
                <tr>
                  <th className="px-5 py-4 font-medium">Job Title</th>
                  <th className="px-5 py-4 font-medium">Company</th>
                  <th className="px-5 py-4 font-medium">Applied</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>

              <tbody>

                {displayedApplications.map((application) => {
                  const Icon = application.icon;

                  return (
                    <tr
                      key={application.id}
                      className="border-b border-[#29292f] last:border-0 hover:bg-[#1b1b21] transition"
                    >

                      {/* Job Title */}
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-md bg-[#25252d] flex items-center justify-center shrink-0">
                            <Icon size={19} className="text-zinc-300" />
                          </div>

                          <div>
                            <p className="text-sm font-medium">
                              {application.title}
                            </p>

                            <p className="text-xs text-zinc-500 mt-0.5">
                              {application.type} • {application.location}
                            </p>
                          </div>

                        </div>
                      </td>

                      {/* Company */}
                      <td className="px-5 py-3 text-sm text-zinc-300">
                        {application.company}
                      </td>

                      {/* Applied */}
                      <td className="px-5 py-3 text-sm text-zinc-400">
                        {application.applied}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
                            statusStyles[application.status]
                          }`}
                        >
                          {application.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() =>
                            setSelectedApplication(application)
                          }
                          className="text-sm text-zinc-300 hover:text-white transition"
                        >
                          Details
                        </button>
                      </td>

                    </tr>
                  );
                })}

              </tbody>
            </table>

          </div>

          {/* Mobile Application Cards */}
          <div className="md:hidden divide-y divide-[#29292f]">

            {displayedApplications.map((application) => {
              const Icon = application.icon;

              return (
                <div
                  key={application.id}
                  className="p-4 space-y-3"
                >

                  <div className="flex items-start gap-3">

                    <div className="w-10 h-10 rounded-lg bg-[#25252d] flex items-center justify-center shrink-0">
                      <Icon size={19} className="text-zinc-300" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium">
                        {application.title}
                      </h3>

                      <p className="text-xs text-zinc-400 mt-1">
                        {application.company}
                      </p>

                      <p className="text-xs text-zinc-500 mt-1">
                        {application.type} • {application.location}
                      </p>
                    </div>

                    <span
                      className={`rounded-full border px-2 py-1 text-[10px] shrink-0 ${
                        statusStyles[application.status]
                      }`}
                    >
                      {application.status}
                    </span>

                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-xs text-zinc-500">
                      Applied {application.applied}
                    </p>

                    <button
                      onClick={() =>
                        setSelectedApplication(application)
                      }
                      className="text-xs text-white hover:text-zinc-300"
                    >
                      View Details →
                    </button>
                  </div>

                </div>
              );
            })}

          </div>

          {/* Empty State */}
          {displayedApplications.length === 0 && (
            <div className="py-16 text-center">
              <BriefcaseBusiness
                size={32}
                className="mx-auto text-zinc-500 mb-3"
              />
              <p className="text-zinc-400 text-sm">
                {emptyMessage}
              </p>

              {!loading && !error && (
                <p className="text-xs text-zinc-500 mt-2">
                  Applications you submit from a job page show up here.
                </p>
              )}
            </div>
          )}

          {/* Footer / Pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 sm:px-5 py-4 border-t border-[#29292f]">

            <p className="text-xs text-zinc-400">
              Showing{" "}
              {currentApplications.length === 0
                ? 0
                : startIndex + 1}
              -
              {Math.min(
                startIndex + itemsPerPage,
                currentApplications.length
              )}{" "}
              of {currentApplications.length} applications
            </p>

            <div className="flex items-center gap-1 print:hidden">

              <button
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#29292f] text-zinc-400 hover:bg-[#25252d] disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={17} />
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => changePage(page)}
                  className={`w-8 h-8 rounded-lg text-xs transition ${
                    currentPage === page
                      ? "bg-white text-black font-semibold"
                      : "text-zinc-400 hover:bg-[#25252d]"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#29292f] text-zinc-400 hover:bg-[#25252d] disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight size={17} />
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* Application Details Modal */}
      {selectedApplication && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setSelectedApplication(null)}
        >
          <div
            className="w-full max-w-md rounded-xl border border-[#303039] bg-[#18181e] p-5 sm:p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">
                Application Details
              </h2>

              <button
                onClick={() => setSelectedApplication(null)}
                className="text-zinc-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">

              <div>
                <p className="text-xs text-zinc-500 mb-1">
                  Job Title
                </p>
                <p className="text-sm font-medium">
                  {selectedApplication.title}
                </p>
              </div>

              <div>
                <p className="text-xs text-zinc-500 mb-1">
                  Company
                </p>
                <p className="text-sm">
                  {selectedApplication.company}
                </p>
              </div>

              <div>
                <p className="text-xs text-zinc-500 mb-1">
                  Employment
                </p>
                <p className="text-sm">
                  {selectedApplication.type} • {selectedApplication.location}
                </p>
              </div>

              <div>
                <p className="text-xs text-zinc-500 mb-1">
                  Applied
                </p>
                <p className="text-sm">
                  {selectedApplication.applied}
                </p>
              </div>

              <div>
                <p className="text-xs text-zinc-500 mb-2">
                  Current Status
                </p>
                <span
                  className={`inline-flex rounded-full border px-3 py-1 text-xs ${
                    statusStyles[selectedApplication.status]
                  }`}
                >
                  {selectedApplication.status}
                </span>
              </div>

            </div>

            <button
              onClick={() => setSelectedApplication(null)}
              className="w-full mt-7 rounded-lg bg-white text-black py-2.5 text-sm font-medium hover:bg-zinc-200 transition"
            >
              Close
            </button>

          </div>
        </div>
      )}

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }

          .print\\:hidden {
            display: none !important;
          }

          * {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>

    </div>
  );
}

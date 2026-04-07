"use client";


import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  total?: number;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  searchable?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  actions?: React.ReactNode;
  loading?: boolean;
  emptyIcon?: React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function DataTable<T>({
  data,
  columns,
  total = 0,
  page = 1,
  pageSize = 10,
  onPageChange,
  searchable = false,
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  actions,
  loading,
  emptyIcon,
  emptyTitle,
  emptyDescription,
}: DataTableProps<T>) {
  const totalPages = Math.ceil(total / pageSize);

  return (
    <Card variant="elevated" padding="none" className="overflow-hidden">
      {/* Toolbar */}
      {(searchable || actions) && (
        <div className="flex items-center justify-between gap-4 p-4 border-b border-[var(--border-color)]">
          {searchable && (
            <div className="w-full max-w-xs">
              <Input
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder={searchPlaceholder}
                size="sm"
                icon={<Search className="h-3.5 w-3.5" />}
              />
            </div>
          )}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--background-alt)] border-b border-[var(--border-color)]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-3 text-left text-xs font-bold text-[var(--foreground-secondary)] uppercase tracking-wider",
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-[var(--border-color)]">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      <div className="h-4 bg-[var(--background-alt)] rounded animate-shimmer" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-16">
                  <div className="flex flex-col items-center justify-center text-center max-w-sm mx-auto">
                    {emptyIcon || (
                      <div className="w-12 h-12 rounded-xl bg-[var(--background-alt)] flex items-center justify-center mb-4">
                        <Search className="h-6 w-6 text-[var(--foreground-secondary)]" />
                      </div>
                    )}
                    <h3 className="text-[var(--foreground)] font-bold text-base mb-1">
                      {emptyTitle || "No records found"}
                    </h3>
                    <p className="text-[var(--foreground-secondary)] text-sm">
                      {emptyDescription || (searchable && searchValue ? "Try adjusting your search to find what you're looking for." : "There is currently no data available.")}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-[var(--border-color)] hover:bg-[var(--background-alt)] transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key} className={cn("px-4 py-3 text-[var(--foreground)]", col.className)}>
                      {col.render ? col.render(row) : String(row[col.key as keyof T] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border-color)]">
          <p className="text-xs text-[var(--foreground-secondary)]">
            Showing {Math.min((page - 1) * pageSize + 1, total)} – {Math.min(page * pageSize, total)} of {total}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onPageChange?.(page - 1)}
              disabled={page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium text-[var(--foreground)] px-2">
              {page} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onPageChange?.(page + 1)}
              disabled={page >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

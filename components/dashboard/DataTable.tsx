"use client";

import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type RowSelectionState,
} from "@tanstack/react-table";
import { ArrowUpDown, ArrowUp, ArrowDown, Search } from "lucide-react";

type DataTableProps<T> = {
  data: T[];
  columns: ColumnDef<T, unknown>[];
  searchPlaceholder?: string;
  filterComponent?: React.ReactNode;
  bulkActions?: (selectedIds: string[]) => React.ReactNode;
  getRowId?: (row: T) => string;
};

export default function DataTable<T>({
  data,
  columns,
  searchPlaceholder = "Rechercher…",
  filterComponent,
  bulkActions,
  getRowId,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter, rowSelection },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getRowId: getRowId as ((row: T) => string) | undefined,
    enableRowSelection: !!bulkActions,
  });

  const selectedIds = Object.keys(rowSelection).filter(
    (k) => rowSelection[k]
  );

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-df-blue/40" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-56 rounded-xl border-2 border-df-blue/15 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-df-blue"
          />
        </div>
        {filterComponent}

        {selectedIds.length > 0 && bulkActions && (
          <div className="ml-auto flex items-center gap-2">
            <span className="rounded-full bg-df-blue/5 px-3 py-1 text-xs font-bold text-df-blue">
              {selectedIds.length} sélectionné{selectedIds.length > 1 ? "s" : ""}
            </span>
            {bulkActions(selectedIds)}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-df-blue/10">
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b border-df-blue/10 text-left">
                {hg.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();
                  return (
                    <th
                      key={header.id}
                      className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-df-ink/40"
                    >
                      {header.isPlaceholder ? null : (
                        <button
                          type="button"
                          className={`inline-flex items-center gap-1.5 ${canSort ? "cursor-pointer select-none hover:text-df-ink" : ""}`}
                          onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {canSort && (
                            <span className="text-df-blue/30">
                              {sorted === "asc" ? (
                                <ArrowUp className="h-3 w-3" />
                              ) : sorted === "desc" ? (
                                <ArrowDown className="h-3 w-3" />
                              ) : (
                                <ArrowUpDown className="h-3 w-3" />
                              )}
                            </span>
                          )}
                        </button>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-12 text-center text-sm text-df-ink/40"
                >
                  Aucun résultat trouvé.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row, i) => (
                <tr
                  key={row.id}
                  className={`border-b border-df-blue/5 transition hover:bg-df-cream/30 ${
                    i % 2 === 0 ? "bg-white" : "bg-df-cream/10"
                  } ${row.getIsSelected() ? "!bg-df-blue/5" : ""}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-5 py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer count */}
      <p className="text-xs text-df-ink/40">
        {table.getFilteredRowModel().rows.length} résultat
        {table.getFilteredRowModel().rows.length > 1 ? "s" : ""}
      </p>
    </div>
  );
}

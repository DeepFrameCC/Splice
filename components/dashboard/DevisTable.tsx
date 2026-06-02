"use client";

import { type ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Download, Eye, Copy } from "lucide-react";
import StatusPill from "@/components/dashboard/StatusPill";
import { ValiderBtn, RefuserBtn, ProposerDateBtn } from "@/components/dashboard/DevisActions";
import DataTable from "@/components/dashboard/DataTable";

export type DevisRow = {
  id: string;
  numero: string;
  nomContact: string;
  nomEntreprise: string;
  pseudo: string;
  pack: string;
  packLabel: string;
  totalHT: number;
  status: string;
  createdAt: string;
};

const columns: ColumnDef<DevisRow, unknown>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <input
        type="checkbox"
        checked={table.getIsAllPageRowsSelected()}
        onChange={table.getToggleAllPageRowsSelectedHandler()}
        className="h-4 w-4 rounded accent-emerald-500"
        aria-label="Sélectionner tout"
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
        className="h-4 w-4 rounded accent-emerald-500"
        aria-label={`Sélectionner devis ${row.original.numero}`}
      />
    ),
    enableSorting: false,
  },
  {
    accessorKey: "numero",
    header: "N°",
    cell: ({ row }) => (
      <Link
        href={`/profil/devis/${row.original.id}`}
        className="font-display text-sm font-bold text-white underline-offset-4 hover:underline"
      >
        {row.original.numero}
      </Link>
    ),
  },
  {
    accessorKey: "nomEntreprise",
    header: "Client",
    cell: ({ row }) => (
      <div>
        <p className="font-bold text-white">
          {row.original.nomEntreprise || row.original.nomContact}
        </p>
        <p className="mt-0.5 text-xs text-white/30">@{row.original.pseudo}</p>
      </div>
    ),
    filterFn: (row, _, filterValue: string) => {
      const v = filterValue.toLowerCase();
      return (
        row.original.nomContact.toLowerCase().includes(v) ||
        row.original.nomEntreprise.toLowerCase().includes(v) ||
        row.original.pseudo.toLowerCase().includes(v)
      );
    },
  },
  {
    accessorKey: "packLabel",
    header: "Pack",
    cell: ({ row }) => (
      <span className="inline-flex rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-white">
        {row.original.packLabel}
      </span>
    ),
  },
  {
    accessorKey: "totalHT",
    header: "Total HT",
    cell: ({ row }) => (
      <span className="font-display text-sm font-bold text-white">
        {row.original.totalHT.toLocaleString("fr-FR")} €
      </span>
    ),
    meta: { className: "text-right" },
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => (
      <StatusPill status={row.original.status as "ATTENTE" | "VALIDE" | "REFUSE" | "PAYE" | "ABONNE"} />
    ),
    filterFn: (row, _, filterValue: string) => {
      if (!filterValue) return true;
      return row.original.status === filterValue;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => (
      <span className="text-xs text-white/40">
        {new Date(row.original.createdAt).toLocaleDateString("fr-FR")}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex flex-wrap items-center gap-2">
        {row.original.status === "ATTENTE" && (
          <>
            <ValiderBtn devisId={row.original.id} />
            <ProposerDateBtn devisId={row.original.id} />
            <RefuserBtn devisId={row.original.id} />
          </>
        )}
        <Link
          href={`/profil/devis/${row.original.id}`}
          className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1.5 text-xs font-bold text-white/70 transition hover:bg-df-gold hover:text-white"
          aria-label={`Voir le devis ${row.original.numero}`}
        >
          <Eye className="h-3 w-3" /> Voir
        </Link>
        <a
          href={`/api/devis/${row.original.id}/pdf`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-full bg-df-surface px-2.5 py-1.5 text-xs font-bold text-white/70 transition hover:bg-df-gold hover:text-white"
          aria-label={`PDF du devis ${row.original.numero}`}
        >
          <Download className="h-3 w-3" /> PDF
        </a>
      </div>
    ),
  },
];

type Props = {
  data: DevisRow[];
  statusFilter: string;
  onStatusChange: (status: string) => void;
};

const statusOptions = [
  { value: "", label: "Tous" },
  { value: "ATTENTE", label: "En attente" },
  { value: "VALIDE", label: "Validé" },
  { value: "REFUSE", label: "Refusé" },
  { value: "PAYE", label: "Payé" },
  { value: "ABONNE", label: "Abonné" },
];

export default function DevisTable({ data, statusFilter, onStatusChange }: Props) {
  const filteredData = statusFilter
    ? data.filter((d) => d.status === statusFilter)
    : data;

  return (
    <DataTable
      data={filteredData}
      columns={columns}
      searchPlaceholder="Rechercher par client, n°…"
      getRowId={(row) => row.id}
      filterComponent={
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="rounded-xl border-2 border-white/10 bg-white/[0.06] px-3 py-2 text-sm font-bold text-white outline-none transition focus:border-white/20"
        >
          {statusOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      }
      bulkActions={(ids) => (
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-xs font-bold text-white/70 transition hover:bg-df-gold hover:text-white"
          onClick={() => {
            const nums = ids
              .map((id) => data.find((d) => d.id === id)?.numero)
              .filter(Boolean)
              .join(", ");
            navigator.clipboard.writeText(nums);
          }}
        >
          <Copy className="h-3 w-3" /> Copier n°
        </button>
      )}
    />
  );
}

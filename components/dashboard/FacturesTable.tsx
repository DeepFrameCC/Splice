"use client";

import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Download, Calendar } from "lucide-react";
import FactureStatusSelect from "@/components/dashboard/FactureStatusSelect";
import DataTable from "@/components/dashboard/DataTable";

export type FactureRow = {
  id: string;
  numero: string;
  devisNumero: string;
  devisId: string | null;
  nomContact: string;
  nomEntreprise: string;
  pseudo: string;
  totalHT: number;
  status: string;
  createdAt: string;
};

const columns: ColumnDef<FactureRow, unknown>[] = [
  {
    accessorKey: "numero",
    header: "N° Facture",
    cell: ({ row }) => (
      <span className="font-display text-sm font-bold text-white">
        {row.original.numero}
      </span>
    ),
  },
  {
    accessorKey: "devisNumero",
    header: "N° Devis",
    cell: ({ row }) => (
      <span className="text-xs text-white/40">{row.original.devisNumero}</span>
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
  },
  {
    accessorKey: "totalHT",
    header: "Montant HT",
    cell: ({ row }) => (
      <span className="font-display text-sm font-bold text-white">
        {row.original.totalHT.toLocaleString("fr-FR")} €
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => (
      <FactureStatusSelect factureId={row.original.id} current={row.original.status} />
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5 text-xs text-white/40">
        <Calendar className="h-3.5 w-3.5" />
        {new Date(row.original.createdAt).toLocaleDateString("fr-FR")}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex flex-wrap items-center gap-2">
        <a
          href={`/api/facture/${row.original.id}/pdf`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-full bg-df-gold/10 px-2.5 py-1.5 text-xs font-bold text-df-gold transition hover:bg-df-gold hover:text-white"
          aria-label={`Télécharger facture ${row.original.numero}`}
        >
          <Download className="h-3 w-3" /> Facture
        </a>
        {row.original.devisId && (
          <a
            href={`/api/devis/${row.original.devisId}/pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-full bg-df-surface px-2.5 py-1.5 text-xs font-bold text-white/70 transition hover:bg-df-gold hover:text-white"
            aria-label={`Télécharger devis ${row.original.devisNumero}`}
          >
            <Download className="h-3 w-3" /> Devis
          </a>
        )}
      </div>
    ),
  },
];

const statusOptions = [
  { value: "", label: "Tous" },
  { value: "EMISE", label: "Émise" },
  { value: "PAYEE", label: "Payée" },
  { value: "ANNULEE", label: "Annulée" },
];

type Props = {
  data: FactureRow[];
  initialStatus: string;
};

export default function FacturesTable({ data, initialStatus }: Props) {
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const filteredData = statusFilter
    ? data.filter((f) => f.status === statusFilter)
    : data;

  return (
    <DataTable
      data={filteredData}
      columns={columns}
      searchPlaceholder="Rechercher facture, client…"
      getRowId={(row) => row.id}
      filterComponent={
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border-2 border-white/10 bg-white/[0.06] px-3 py-2 text-sm font-bold text-white outline-none transition focus:border-white/20"
        >
          {statusOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      }
    />
  );
}

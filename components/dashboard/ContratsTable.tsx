"use client";

import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Calendar, FileText } from "lucide-react";
import StatusPill from "@/components/dashboard/StatusPill";
import ContratStatusSelect from "@/components/dashboard/ContratStatusSelect";
import DataTable from "@/components/dashboard/DataTable";

export type ContratRow = {
  id: string;
  numero: string;
  devisNumero: string;
  devisId: string;
  nomContact: string;
  nomEntreprise: string;
  pseudo: string;
  totalHT: number;
  status: string;
  createdAt: string;
  dateTournage: string | null;
};

const columns: ColumnDef<ContratRow, unknown>[] = [
  {
    accessorKey: "numero",
    header: "N° Contrat",
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
      <Link
        href={`/profil/devis/${row.original.devisId}`}
        className="text-xs text-white/60 underline-offset-4 hover:underline hover:text-white"
      >
        {row.original.devisNumero}
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
      <StatusPill status={row.original.status as "A_VENIR" | "EN_COURS" | "FINI"} />
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => (
      <div>
        <div className="flex items-center gap-1.5 text-xs text-white/40">
          <Calendar className="h-3.5 w-3.5" />
          {new Date(row.original.createdAt).toLocaleDateString("fr-FR")}
        </div>
        {row.original.dateTournage && (
          <p className="mt-0.5 flex items-center gap-1.5 text-[10px] text-df-gold">
            <Calendar className="h-3 w-3" />
            Tournage : {new Date(row.original.dateTournage).toLocaleDateString("fr-FR")}
          </p>
        )}
      </div>
    ),
  },
  {
    id: "gestion",
    header: "Gestion",
    enableSorting: false,
    cell: ({ row }) => (
      <ContratStatusSelect contratId={row.original.id} current={row.original.status} />
    ),
  },
  {
    id: "pdf",
    header: "PDF",
    enableSorting: false,
    cell: ({ row }) => (
      <a
        href={`/api/contrat/${row.original.id}/pdf`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-xs font-bold text-white transition hover:bg-white/10"
      >
        <FileText className="h-3.5 w-3.5" />
        Contrat
      </a>
    ),
  },
];

const statusOptions = [
  { value: "", label: "Tous" },
  { value: "A_VENIR", label: "À venir" },
  { value: "EN_COURS", label: "En cours" },
  { value: "FINI", label: "Terminé" },
];

type Props = {
  data: ContratRow[];
  initialStatus: string;
};

export default function ContratsTable({ data, initialStatus }: Props) {
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const filteredData = statusFilter
    ? data.filter((c) => c.status === statusFilter)
    : data;

  return (
    <DataTable
      data={filteredData}
      columns={columns}
      searchPlaceholder="Rechercher contrat, client…"
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

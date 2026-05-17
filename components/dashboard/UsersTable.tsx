"use client";

import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Mail, Calendar, Eye } from "lucide-react";
import RoleSelect from "@/components/dashboard/RoleSelect";
import AnonymiserBtn from "@/components/dashboard/AnonymiserBtn";
import DataTable from "@/components/dashboard/DataTable";
import type { Role } from "@prisma/client";

export type UserRow = {
  id: string;
  pseudo: string;
  email: string;
  role: Role;
  displayName: string;
  initial: string;
  devisCount: number;
  likesCount: number;
  createdAt: string;
  isAdmin: boolean;
};

function makeColumns(adminId: string): ColumnDef<UserRow, unknown>[] {
  return [
    {
      accessorKey: "displayName",
      header: "Utilisateur",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-df-blue/10 text-xs font-bold text-df-blue">
            {row.original.initial}
          </div>
          <div>
            <p className="font-bold text-white">{row.original.displayName}</p>
            <p className="text-xs text-white/30">@{row.original.pseudo}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-white/70">
          <Mail className="h-3.5 w-3.5 text-white/20" />
          <span className="text-sm">{row.original.email}</span>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Rôle",
      cell: ({ row }) => (
        <RoleSelect
          userId={row.original.id}
          currentRole={row.original.role}
          isSelf={row.original.id === adminId}
        />
      ),
      filterFn: (row, _, filterValue: string) => {
        if (!filterValue) return true;
        return row.original.role === filterValue;
      },
    },
    {
      accessorKey: "devisCount",
      header: "Devis",
      cell: ({ row }) => (
        <span className="font-display font-bold text-white">
          {row.original.devisCount}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Inscrit le",
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
          <Link
            href={`/admin/utilisateurs/${row.original.id}`}
            className="inline-flex items-center gap-1 rounded-full bg-df-blue/5 px-2.5 py-1.5 text-xs font-bold text-df-blue transition hover:bg-df-blue hover:text-white"
          >
            <Eye className="h-3 w-3" /> 360°
          </Link>
          {row.original.id !== adminId && row.original.role === "CLIENT" && (
            <AnonymiserBtn userId={row.original.id} pseudo={row.original.pseudo} />
          )}
        </div>
      ),
    },
  ];
}

const roleOptions = [
  { value: "", label: "Tous les rôles" },
  { value: "CLIENT", label: "Client" },
  { value: "TEAM", label: "Équipe" },
  { value: "ADMIN", label: "Admin" },
];

type Props = {
  data: UserRow[];
  adminId: string;
};

export default function UsersTable({ data, adminId }: Props) {
  const [roleFilter, setRoleFilter] = useState("");
  const columns = makeColumns(adminId);
  const filteredData = roleFilter
    ? data.filter((u) => u.role === roleFilter)
    : data;

  return (
    <DataTable
      data={filteredData}
      columns={columns}
      searchPlaceholder="Rechercher par nom, email, pseudo…"
      getRowId={(row) => row.id}
      filterComponent={
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-xl border-2 border-white/10 px-3 py-2 text-sm font-bold text-df-blue outline-none transition focus:border-df-blue"
        >
          {roleOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      }
    />
  );
}

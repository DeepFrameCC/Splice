"use client";

import { useState } from "react";
import DevisTable, { type DevisRow } from "./DevisTable";

type Props = {
  data: DevisRow[];
  initialStatus: string;
};

export default function DevisTableWrapper({ data, initialStatus }: Props) {
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  return (
    <DevisTable
      data={data}
      statusFilter={statusFilter}
      onStatusChange={setStatusFilter}
    />
  );
}

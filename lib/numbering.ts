import { CounterType, Prisma } from "@prisma/client";
import { db } from "./db";

const pad = (n: number) => (n < 1000 ? n.toString().padStart(3, "0") : n.toString());
const fmt = (annee: number, seq: number) => `${annee}_${pad(seq)}`;

export async function nextNumero(
  type: CounterType,
  tx?: Prisma.TransactionClient
): Promise<{ numero: string; annee: number; sequence: number }> {
  const client = tx ?? db;
  const annee = new Date().getFullYear();

  const counter = await client.counter.upsert({
    where: { annee_type: { annee, type } },
    create: { annee, type, lastSequence: 1 },
    update: { lastSequence: { increment: 1 } }
  });

  return { numero: fmt(annee, counter.lastSequence), annee, sequence: counter.lastSequence };
}

export const formatNumero = fmt;

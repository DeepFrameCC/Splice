import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    throw new Error("Sentry Example API Route Error (Splice Test Handler)");
  } catch (err: unknown) {
    // Sentry will automatically capture uncaught exceptions in route handlers, 
    // but we can also manually capture it to be doubly sure and return a structured response.
    Sentry.captureException(err);
    
    return NextResponse.json(
      { error: "Simulated Sentry API Error captured successfully." },
      { status: 500 }
    );
  }
}

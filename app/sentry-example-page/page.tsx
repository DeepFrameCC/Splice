"use client";

import { useState } from "react";
import * as Sentry from "@sentry/nextjs";
import { triggerServerActionError as runServerAction } from "./actions";

export default function SentryExamplePage() {
  const [loadingAction, setLoadingAction] = useState(false);
  const [loadingApi, setLoadingApi] = useState(false);

  // 1. Client-Side Error (Throws instantly in the browser)
  const triggerClientError = () => {
    throw new Error("Sentry Example Client-Side Error (Splice Test Page)");
  };

  // 2. Server Action Error (Throws on the server inside an action)
  const triggerServerActionError = async () => {
    setLoadingAction(true);
    try {
      await runServerAction();
    } catch (err: unknown) {
      Sentry.captureException(err);
      alert("Server Action error captured! Check Sentry Issues.");
    } finally {
      setLoadingAction(false);
    }
  };

  // 3. API Route Error (Fetches a route that throws an error)
  const triggerApiError = async () => {
    setLoadingApi(true);
    try {
      const response = await fetch("/api/sentry-example-api");
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
    } catch (err: unknown) {
      Sentry.captureException(err);
      alert("API Route error captured! Check Sentry Issues.");
    } finally {
      setLoadingApi(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0E0E22] text-[#F4F4F5] font-sans antialiased flex flex-col justify-between py-16 px-6 relative overflow-hidden">
      {/* Dynamic Cinematic Background Accent */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#F36B1F]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#2E4239]/10 blur-[150px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-4xl w-full mx-auto my-auto z-10 space-y-12">
        {/* Header Block */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#F36B1F]/20 bg-[#F36B1F]/5 text-[#F36B1F] text-xs font-bold uppercase tracking-widest">
            Diagnostics & Monitoring
          </div>
          <h1 className="font-display text-4xl sm:text-6xl uppercase tracking-tight text-wrap balance leading-none font-bold">
            Sentry <em className="text-[#F36B1F] not-italic font-bold">Verification</em>
          </h1>
          <p className="max-w-xl mx-auto text-sm text-[#F4F4F5]/60 font-light leading-relaxed">
            Test and verify your Sentry configuration across different execution environments. Click the triggers below to dispatch test reports directly to Sentry.
          </p>
        </div>

        {/* Test Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          
          {/* Client-Side Test Card */}
          <div className="flex flex-col justify-between p-8 rounded-2xl border border-white/5 bg-[#0A0A1C] transition-all hover:-translate-y-1 hover:border-[#F36B1F]/30 hover:shadow-lg hover:shadow-[#F36B1F]/5 group">
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-widest font-bold text-[#F36B1F]/80">01 / Runtime Client</span>
              <h3 className="font-display text-2xl uppercase tracking-tight text-white group-hover:text-[#F36B1F] transition-colors">
                Client Error
              </h3>
              <p className="text-xs text-[#F4F4F5]/50 leading-relaxed font-light">
                Triggers an instant JavaScript exception in the browser. Tests Sentry&apos;s client-side capture pipeline, breadcrumbs, and Session Replay tracing.
              </p>
            </div>
            <button
              onClick={triggerClientError}
              className="mt-8 w-full py-3.5 px-5 bg-[#F36B1F] hover:bg-[#C4550A] text-[#1A1408] text-xs font-bold uppercase tracking-widest rounded-full transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-[#F36B1F]/20"
            >
              Throw Client Error
            </button>
          </div>

          {/* Server Action Test Card */}
          <div className="flex flex-col justify-between p-8 rounded-2xl border border-white/5 bg-[#0A0A1C] transition-all hover:-translate-y-1 hover:border-[#F36B1F]/30 hover:shadow-lg hover:shadow-[#F36B1F]/5 group">
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-widest font-bold text-[#F36B1F]/80">02 / RSC Server Action</span>
              <h3 className="font-display text-2xl uppercase tracking-tight text-white group-hover:text-[#F36B1F] transition-colors">
                Server Action
              </h3>
              <p className="text-xs text-[#F4F4F5]/50 leading-relaxed font-light">
                Executes a secure &quot;use server&quot; action. Tests server-side error capturing, node/edge runtime execution environment logging, and call stack trace mappings.
              </p>
            </div>
            <button
              onClick={triggerServerActionError}
              disabled={loadingAction}
              className="mt-8 w-full py-3.5 px-5 bg-transparent hover:bg-white/[0.04] text-[#F4F4F5] hover:text-white text-xs font-bold uppercase tracking-widest rounded-full border border-white/10 transition-all hover:border-[#F36B1F]/30 disabled:opacity-50"
            >
              {loadingAction ? "Executing..." : "Trigger Server Action"}
            </button>
          </div>

          {/* API Route Test Card */}
          <div className="flex flex-col justify-between p-8 rounded-2xl border border-white/5 bg-[#0A0A1C] transition-all hover:-translate-y-1 hover:border-[#F36B1F]/30 hover:shadow-lg hover:shadow-[#F36B1F]/5 group">
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-widest font-bold text-[#F36B1F]/80">03 / Route Handler</span>
              <h3 className="font-display text-2xl uppercase tracking-tight text-white group-hover:text-[#F36B1F] transition-colors">
                API Route Error
              </h3>
              <p className="text-xs text-[#F4F4F5]/50 leading-relaxed font-light">
                Fetches an asynchronous endpoint that throws a simulated server error. Tests edge runtime, API middleware integration, and request-response captures.
              </p>
            </div>
            <button
              onClick={triggerApiError}
              disabled={loadingApi}
              className="mt-8 w-full py-3.5 px-5 bg-transparent hover:bg-white/[0.04] text-[#F4F4F5] hover:text-white text-xs font-bold uppercase tracking-widest rounded-full border border-white/10 transition-all hover:border-[#F36B1F]/30 disabled:opacity-50"
            >
              {loadingApi ? "Requesting..." : "Trigger API Error"}
            </button>
          </div>

        </div>

        {/* Info Box */}
        <div className="p-6 rounded-2xl border border-[#2E4239]/40 bg-[#2E4239]/5 text-sm text-[#C4D2C5] flex flex-col sm:flex-row gap-4 items-center sm:items-start max-w-2xl mx-auto">
          <svg className="w-5 h-5 text-[#F36B1F] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">Production Note</h4>
            <p className="text-xs font-light text-[#C4D2C5]/80">
              Please delete the <code>app/sentry-example-page</code> and <code>app/api/sentry-example-api</code> routes before deploying to production as they are meant only for configuration auditing.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-[10px] text-[#F4F4F5]/30 uppercase tracking-widest z-10 pt-12">
        Splice Cinéma Studio © {new Date().getFullYear()} · Diagnostics Console
      </footer>
    </main>
  );
}

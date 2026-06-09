"use client";

import { useEffect } from "react";
import * as amplitude from "@amplitude/unified";

export default function AmplitudeAnalytics() {
  useEffect(() => {
    console.log("DEBUG NEXT_PUBLIC_AMPLITUDE_API_KEY:", process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY);
    amplitude.initAll(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY!, {
      analytics: {
        serverZone: "EU",                              // route data to EU data center
        remoteConfig: { fetchRemoteConfig: true },     // remote SDK config from Amplitude
        autocapture: {
          attribution: true,           // UTM / referrer attribution events
          pageViews: true,             // SPA route changes + initial page load
          sessions: true,              // Session start / end events
          formInteractions: true,      // Form starts + submits
          fileDownloads: true,         // Downloads of common file types
          elementInteractions: true,   // Click + change on instrumented elements
          frustrationInteractions: true, // Rage clicks, dead clicks
          pageUrlEnrichment: true,     // Adds path / search to event props
          networkTracking: true,       // XHR + fetch request events
          webVitals: true,             // CWV (LCP, INP, CLS) on page hide
        },
      },
      sessionReplay: { sampleRate: 1 }, // Record user sessions; lower in production if needed
      engagement: {},                    // In-product Guides & Surveys
    });
  }, []);

  return null;
}

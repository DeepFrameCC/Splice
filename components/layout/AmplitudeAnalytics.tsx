"use client";

import { useEffect } from "react";
import * as amplitude from "@amplitude/unified";

export default function AmplitudeAnalytics() {
  useEffect(() => {
    amplitude.initAll("c3065e4c976bce1ddf0b06125132eb3d", {
      serverZone: "EU",
      analytics: {
        autocapture: true,
      },
      sessionReplay: {
        sampleRate: 1,
      },
    });
  }, []);

  return null;
}

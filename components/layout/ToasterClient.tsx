"use client";

import { Toaster } from "react-hot-toast";

export default function ToasterClient() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{ style: { background: "#1901AD", color: "#fff" } }}
    />
  );
}

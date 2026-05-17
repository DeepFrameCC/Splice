"use client";

import { Toaster } from "react-hot-toast";

export default function ToasterClient() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{ style: { background: "#F36B1F", color: "#fff" } }}
    />
  );
}

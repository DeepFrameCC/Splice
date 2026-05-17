import NavWrapper from "@/components/layout/NavWrapper";

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavWrapper />
      {children}
    </>
  );
}

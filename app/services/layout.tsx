import Nav from "@/components/layout/Nav";

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      {children}
    </>
  );
}

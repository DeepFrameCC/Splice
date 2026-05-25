import NavWrapper from "@/components/layout/NavWrapper";
import Footer from "@/components/layout/Footer";

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavWrapper />
      {children}
      <Footer />
    </>
  );
}

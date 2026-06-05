import NavWrapper from "@/components/layout/NavWrapper";
import Footer from "@/components/layout/Footer";
import { StickyMobileCta } from "@/components/marketing/StickyMobileCta";

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="df-site">
      <NavWrapper />
      {children}
      {/* Reserve space so the fixed mobile CTA never hides footer content */}
      <div aria-hidden className="h-16 md:hidden" />
      <Footer />
      <StickyMobileCta source="sticky_service" />
    </div>
  );
}

import { auth } from "@/lib/auth";
import ProfilSidebar from "@/components/dashboard/ProfilSidebar";

export default async function ProfilLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-[260px_1fr]">
      <ProfilSidebar userName={session?.user?.name ?? ""} isAdmin={isAdmin} />
      <div>{children}</div>
    </section>
  );
}

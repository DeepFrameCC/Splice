import { auth } from "@/lib/auth";
import HomeContent from "@/components/home/HomeContent";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await auth();
  const user = session?.user
    ? {
        name: session.user.name || "",
        role: session.user.role || "CLIENT",
      }
    : null;

  return <HomeContent user={user} />;
}

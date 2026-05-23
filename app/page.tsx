import { auth } from "@/lib/auth";
import HomeContent from "@/components/home/HomeContent";
import { buildWebSiteJsonLd, buildLocalBusinessJsonLd } from "@/lib/seo";

export default async function Home() {
  const session = await auth();
  const user = session?.user
    ? {
        name: session.user.name || "",
        role: session.user.role || "CLIENT",
      }
    : null;

  const jsonLd = [buildWebSiteJsonLd(), buildLocalBusinessJsonLd()];

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeContent user={user} />
    </>
  );
}

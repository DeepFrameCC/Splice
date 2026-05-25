import { auth } from "@/lib/auth";
import HomeContent from "@/components/home/HomeContent";
import JsonLd from "@/components/JsonLd";
import { buildWebSiteJsonLd, buildLocalBusinessJsonLd } from "@/lib/seo";

export default async function Home() {
  const session = await auth();
  const user = session?.user
    ? {
        name: session.user.name || "",
        role: session.user.role || "CLIENT",
      }
    : null;

  return (
    <>
      <JsonLd data={[buildWebSiteJsonLd(), buildLocalBusinessJsonLd()]} />
      <HomeContent user={user} />
    </>
  );
}

import { auth } from "@/lib/auth";
import Nav from "./Nav";

export default async function NavWrapper() {
  const session = await auth();
  const sessionUser = session?.user as Record<string, unknown> | undefined;

  const user = sessionUser
    ? {
        name: (sessionUser.name as string) || (sessionUser.pseudo as string) || "",
        role: (sessionUser.role as string) || "CLIENT",
      }
    : null;

  return <Nav user={user} />;
}

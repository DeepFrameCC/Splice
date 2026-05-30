import HomeContent from "@/components/home/HomeContent";

export const revalidate = 3600; // statique + ISR (plus de force-dynamic ni await auth())

export default function Home() {
  return <HomeContent />;
}

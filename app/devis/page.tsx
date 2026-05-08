import Wizard from "@/components/devis/Wizard";

export default function DevisPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <header className="mb-8 text-center">
        <h1 className="font-display text-5xl italic text-df-blue md:text-6xl">Demandez votre devis</h1>
        <p className="mt-3 text-df-blue/70">4 étapes simples — récap en temps réel.</p>
      </header>
      <Wizard />
    </section>
  );
}

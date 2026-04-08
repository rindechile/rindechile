import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Página no encontrada | RindeChile",
  description: "La página que buscas no existe o fue movida.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center" role="alert">
      <h1 className="text-2xl font-semibold">Pagina no encontrada</h1>
      <p className="text-muted-foreground max-w-md">
        La pagina que buscas no existe o fue movida.
      </p>
      <Link
        href="/"
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  );
}

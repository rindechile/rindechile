import { ExternalLink, Info } from "lucide-react";

export function SunsetBanner() {
  return (
    <section
      aria-label="Aviso sobre el estado del proyecto"
      className="w-full border-b border-border bg-card"
    >
      <div className="mx-auto flex max-w-5xl items-center gap-4 px-6 py-3 text-xs tablet:items-center tablet:justify-center tablet:text-center">
        <Info
          className="mt-0.5 size-4 shrink-0 text-muted-foreground tablet:mt-0"
          aria-hidden="true"
        />
        <p className="text-muted-foreground leading-relaxed">
          <span className="font-medium text-foreground">
            RindeChile ya no está en desarrollo.
          </span>{" "}
          Agradecemos a todas las personas que hicieron posible este proyecto.
          Para seguir monitoreando las compras públicas, recomendamos el{" "}
          <a
            href="https://mercadopublico.decidechile.cl/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Monitor de Mercado Público de DecideChile (abre en nueva pestaña)"
            className="inline-flex items-center gap-1 font-medium text-foreground underline underline-offset-4 transition-colors duration-200 hover:text-primary"
          >
            Monitor de Mercado Público de DecideChile
            <ExternalLink className="size-3" aria-hidden="true" />
          </a>
          .
        </p>
      </div>
    </section>
  );
}

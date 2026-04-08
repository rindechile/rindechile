"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center" role="alert">
      <h2 className="text-xl font-semibold">Algo salió mal</h2>
      <p className="text-muted-foreground max-w-md">
        Ocurrió un error inesperado. Por favor, intenta nuevamente.
      </p>
      <button
        onClick={reset}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Reintentar
      </button>
    </div>
  );
}

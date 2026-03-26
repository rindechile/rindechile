"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body className="bg-black text-white">
        <div style={{ display: "flex", minHeight: "100vh", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem", padding: "1rem", textAlign: "center" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600 }}>Algo salió mal</h2>
          <p style={{ color: "#a1a1aa", maxWidth: "28rem" }}>
            Ocurrió un error inesperado. Por favor, intenta nuevamente.
          </p>
          <button
            onClick={reset}
            style={{ borderRadius: "0.375rem", backgroundColor: "#fff", color: "#000", padding: "0.5rem 1rem", fontSize: "0.875rem", fontWeight: 500, cursor: "pointer", border: "none" }}
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}

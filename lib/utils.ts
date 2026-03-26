import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("es-CL").format(num);
}

export function toSentenceCase(text: string): string {
  return text.toLowerCase().charAt(0).toUpperCase() + text.toLowerCase().slice(1);
}

const MERCADO_PUBLICO_BASE_URL = "https://www.mercadopublico.cl/PurchaseOrder/Modules/PO/DetailsPurchaseOrder.aspx";

export function getChileCompraUrl(code: string): string {
  return `${MERCADO_PUBLICO_BASE_URL}?codigoOC=${code}`;
}

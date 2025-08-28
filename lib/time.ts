// lib/time.ts
export const BRAZIL_TZ = 'America/Sao_Paulo';

/**
 * Retorna um Date "equivalente" ao horário atual no fuso desejado,
 * sem precisar de libs externas.
 */
export function zonedNow(tz: string = BRAZIL_TZ): Date {
  const now = new Date();
  // Converte para string no fuso, depois volta para Date e calcula o offset
  const inv = new Date(now.toLocaleString('en-US', { timeZone: tz }));
  const diff = now.getTime() - inv.getTime();
  return new Date(now.getTime() - diff);
}

/**
 * Converte uma data dada (Date/string/epoch) para um Date equivalente no fuso.
 */
export function toZoned(date: Date | string | number, tz: string = BRAZIL_TZ): Date {
  const d = new Date(date);
  const inv = new Date(d.toLocaleString('en-US', { timeZone: tz }));
  const diff = d.getTime() - inv.getTime();
  return new Date(d.getTime() - diff);
}

/** Alias compatível com o que seu código esperava */
export function brazilTime(): Date {
  return zonedNow(BRAZIL_TZ);
}
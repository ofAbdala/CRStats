// lib/time.ts
export const BRAZIL_TZ = 'America/Sao_Paulo';

// Converte "20250826T032310.000Z" -> "2025-08-26T03:23:10.000Z" e cria Date
export function parseClashTime(input?: string | null): Date | null {
  if (!input || typeof input !== 'string') return null;
  
  // Já é ISO?
  if (/^\d{4}-\d{2}-\d{2}T/.test(input)) {
    const d = new Date(input);
    return isNaN(d.getTime()) ? null : d;
  }
  
  // Formato Clash: YYYYMMDDTHHMMSS(.mmm)?Z
  const m = input.match(
    /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(\.\d+)?Z$/
  );
  if (!m) return null;
  
  const [, Y, Mo, D, H, Mi, S, Ms = '.000'] = m;
  const iso = `${Y}-${Mo}-${D}T${H}:${Mi}:${S}${Ms}Z`;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d;
}

export function toZoned(date: Date, tz = BRAZIL_TZ): Date {
  // Cria "equivalente" no fuso
  const inv = new Date(date.toLocaleString('en-US', { timeZone: tz }));
  const diff = date.getTime() - inv.getTime();
  return new Date(date.getTime() - diff);
}

export function formatDateTime(
  dateLike?: string | Date | null,
  opts?: Intl.DateTimeFormatOptions,
  tz = BRAZIL_TZ
): string {
  if (!dateLike) return '--';
  
  const d = typeof dateLike === 'string' ? parseClashTime(dateLike) : new Date(dateLike);
  if (!d || isNaN(d.getTime())) return '--';
  
  const z = toZoned(d, tz);
  
  // Check if opts contains individual date/time components
  const hasIndividualComponents = opts && (
    'year' in opts || 'month' in opts || 'day' in opts ||
    'hour' in opts || 'minute' in opts || 'second' in opts ||
    'weekday' in opts || 'era' in opts || 'timeZoneName' in opts
  );
  
  const formatOptions: Intl.DateTimeFormatOptions = {
    timeZone: tz,
    ...opts,
  };
  
  // Only add dateStyle/timeStyle if no individual components are specified
  if (!hasIndividualComponents && !opts) {
    formatOptions.dateStyle = 'short';
    formatOptions.timeStyle = 'short';
  }
  
  return new Intl.DateTimeFormat('pt-BR', formatOptions).format(z);
}

export function formatDateOnly(
  dateLike?: string | Date | null,
  tz = BRAZIL_TZ
): string {
  return formatDateTime(dateLike, { dateStyle: 'medium', timeStyle: undefined }, tz);
}

export function formatTimeOnly(
  dateLike?: string | Date | null,
  tz = BRAZIL_TZ
): string {
  return formatDateTime(dateLike, { dateStyle: undefined, timeStyle: 'short' }, tz);
}

// Função extra para mostrar "há X tempo"
export function formatAgo(dateLike?: string | Date | null): string {
  const d = typeof dateLike === 'string' ? parseClashTime(dateLike) : new Date(dateLike!);
  if (!d || isNaN(d.getTime())) return '--';
  
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  
  if (mins < 1) return 'agora';
  if (mins < 60) return `há ${mins} min`;
  
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `há ${hrs} h`;
  
  const days = Math.floor(hrs / 24);
  return `há ${days} d`;
}

// Função para calcular duração entre duas datas
export function calculateDuration(
  startDate?: string | Date | null,
  endDate?: string | Date | null
): string {
  const start = typeof startDate === 'string' ? parseClashTime(startDate) : new Date(startDate!);
  const end = typeof endDate === 'string' ? parseClashTime(endDate) : new Date(endDate!);
  
  if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) return '--';
  
  const diff = end.getTime() - start.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

// Função para verificar se uma data é de hoje
export function isToday(dateLike?: string | Date | null, tz = BRAZIL_TZ): boolean {
  const d = typeof dateLike === 'string' ? parseClashTime(dateLike) : new Date(dateLike!);
  if (!d || isNaN(d.getTime())) return false;
  
  const today = new Date();
  const target = toZoned(d, tz);
  
  return (
    today.getFullYear() === target.getFullYear() &&
    today.getMonth() === target.getMonth() &&
    today.getDate() === target.getDate()
  );
}

// Função para ordenar array por data (mais recente primeiro)
export function sortByDate<T extends { battleTime?: string }>(
  items: T[],
  dateField: keyof T = 'battleTime' as keyof T,
  ascending = false
): T[] {
  return items
    .map(item => ({
      ...item,
      _parsedDate: parseClashTime(item[dateField] as string)
    }))
    .filter(item => item._parsedDate)
    .sort((a, b) => {
      const dateA = a._parsedDate!.getTime();
      const dateB = b._parsedDate!.getTime();
      return ascending ? dateA - dateB : dateB - dateA;
    })
    .map(({ _parsedDate, ...item }) => item);
}

/** Alias compatível com o que seu código esperava */
export function brazilTime(): Date {
  return toZoned(new Date(), BRAZIL_TZ);
}
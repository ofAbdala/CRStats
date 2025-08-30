// lib/time.ts

export const BRAZIL_TZ = 'America/Sao_Paulo';

// Tipos estendidos para cobrir chaves que nem sempre existem no TS alvo
export type ExtendedDateTimeFormatOptions = Intl.DateTimeFormatOptions & {
  /** 0–3 dígitos fracionários de segundos (nem todos runtimes suportam) */
  fractionalSecondDigits?: 0 | 1 | 2 | 3;
  /** Alguns runtimes suportam periodos do dia (am/pm estendido) */
  dayPeriod?: 'narrow' | 'short' | 'long';
  /** Ciclo horário */
  hourCycle?: 'h11' | 'h12' | 'h23' | 'h24';
};

// Lista de chaves permitidas (sanitização); use `as const` para manter tipagem literal
const ALLOWED_KEYS = [
  'localeMatcher',
  'calendar',
  'numberingSystem',
  'timeZone',
  'hour12',
  'hourCycle',
  'formatMatcher',
  'weekDay',     // Obs: em alguns TS é "weekday" (com k minúsculo). Ver tratativa abaixo.
  'weekday',
  'era',
  'year',
  'month',
  'day',
  'hour',
  'minute',
  'second',
  'timeZoneName',
  'dayPeriod',
  'fractionalSecondDigits',
] as const;

// Type helper: restringe keys para as do tipo estendido
type AllowedKey = typeof ALLOWED_KEYS[number] & keyof ExtendedDateTimeFormatOptions;

/**
 * Normaliza as opções recebidas para evitar chaves inválidas em runtimes
 * e evita o erro de tipo no build. Remove também valores undefined.
 */
function sanitizeDTFOptions(
  input: Partial<ExtendedDateTimeFormatOptions>
): ExtendedDateTimeFormatOptions {
  const out: ExtendedDateTimeFormatOptions = {};

  // Alias de compatibilidade: alguns códigos podem ter usado "weekDay"
  const normalizedInput: Record<string, unknown> = { ...input };
  if (normalizedInput['weekDay'] !== undefined && normalizedInput['weekday'] === undefined) {
    normalizedInput['weekday'] = normalizedInput['weekDay'];
  }

  for (const key of ALLOWED_KEYS) {
    const val = normalizedInput[key as string];
    if (val !== undefined) {
      // atribuição com `as any` para acomodar chaves opcionais não presentes no lib dom
      (out as any)[key] = val;
    }
  }

  return out;
}

/** Fallback seguro caso Intl quebre com alguma opção não suportada */
function safeFormat(
  date: Date,
  options: Partial<ExtendedDateTimeFormatOptions>
): string {
  try {
    return new Intl.DateTimeFormat('pt-BR', options).format(date);
  } catch {
    const basic: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: options.timeZone ?? 'America/Sao_Paulo',
      hour12: false,
    };
    return new Intl.DateTimeFormat('pt-BR', basic).format(date);
  }
}

/** Normaliza entrada para Date válido; se inválido, retorna null */
function toValidDate(d: string | number | Date | undefined | null): Date | null {
  if (d == null) return null;
  const date = d instanceof Date ? d : new Date(d);
  return isNaN(date.getTime()) ? null : date;
}

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

/** Formata data+hora com TZ padrão BR se não fornecida */
export function formatDateTime(
  dateLike: string | number | Date | undefined | null,
  opts: Partial<ExtendedDateTimeFormatOptions> = {}
): string {
  const d = toValidDate(dateLike);
  if (!d) return '—';

  const options = sanitizeDTFOptions({
    timeZone: 'America/Sao_Paulo',
    ...opts,
  });

  return safeFormat(d, options);
}

/** Apenas data (dd/mm/aaaa) */
export function formatDateOnly(
  dateLike: string | number | Date | undefined | null,
  opts: Partial<ExtendedDateTimeFormatOptions> = {}
): string {
  const d = toValidDate(dateLike);
  if (!d) return '—';

  const options = sanitizeDTFOptions({
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...opts,
  });

  return safeFormat(d, options);
}

/** Apenas hora (HH:mm:ss) */
export function formatTimeOnly(
  dateLike: string | number | Date | undefined | null,
  opts: Partial<ExtendedDateTimeFormatOptions> = {}
): string {
  const d = toValidDate(dateLike);
  if (!d) return '—';

  const options = sanitizeDTFOptions({
    timeZone: 'America/Sao_Paulo',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    ...opts,
  });

  return safeFormat(d, options);
}

/** Ex: "há 5m", "há 2h", "há 3d" */
export function formatRelativeAgo(
  dateLike: string | number | Date | undefined | null
): string {
  const d = toValidDate(dateLike);
  if (!d) return '—';
  const diffMs = Date.now() - d.getTime();
  const s = Math.max(0, Math.floor(diffMs / 1000));
  if (s < 60) return `há ${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `há ${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `há ${h}h`;
  const dd = Math.floor(h / 24);
  return `há ${dd}d`;
}

// Função extra para mostrar "há X tempo" (alias para compatibilidade)
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
  // Create intermediate array with explicit separation of original item and parsed date
  const itemsWithDates = items
    .map(item => ({
      originalItem: item,
      parsedDate: parseClashTime(item[dateField] as string)
    }))
    .filter(({ parsedDate }) => parsedDate !== null);

  // Sort by parsed date
  const sorted = itemsWithDates.sort((a, b) => {
    const dateA = a.parsedDate!.getTime();
    const dateB = b.parsedDate!.getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });

  // Return only the original items
  return sorted.map(({ originalItem }) => originalItem);
}
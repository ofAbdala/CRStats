import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function timeAgo(dateString: string): string {
  if (!dateString) return '';
  try {
    // Parse the ISO string (e.g., 20231120T153000.000Z) or standard ISO
    // Supercell API often returns: YYYYMMDDTHHMMSS.000Z
    let date = new Date(dateString);

    // Handle Supercell's specific format if standard parsing fails or if needed
    if (isNaN(date.getTime())) {
      // Simple fallback or custom parser could go here
      // For now assuming standard ISO or compatible string
      return '';
    }

    return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
  } catch (e) {
    return '';
  }
}

export function formatDateTime(dateString: string): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch (e) {
    return '';
  }
}
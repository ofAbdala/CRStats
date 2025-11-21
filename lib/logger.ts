// Structured logging utility for the application
// Replaces console.log with environment-aware logging

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
    data?: any;
}

class Logger {
    private isDevelopment = process.env.NODE_ENV !== 'production';

    private formatMessage(level: LogLevel, message: string, data?: any): LogEntry {
        return {
            timestamp: new Date().toISOString(),
            level,
            message,
            data
        };
    }

    debug(message: string, data?: any) {
        if (this.isDevelopment) {
            const entry = this.formatMessage('debug', message, data);
            console.log(`[DEBUG] ${entry.timestamp} - ${message}`, data || '');
        }
    }

    info(message: string, data?: any) {
        if (this.isDevelopment) {
            const entry = this.formatMessage('info', message, data);
            console.info(`[INFO] ${entry.timestamp} - ${message}`, data || '');
        }
    }

    warn(message: string, data?: any) {
        const entry = this.formatMessage('warn', message, data);
        console.warn(`[WARN] ${entry.timestamp} - ${message}`, data || '');
        // TODO: Send to error tracking service in production
    }

    error(message: string, error?: any) {
        const entry = this.formatMessage('error', message, error);
        console.error(`[ERROR] ${entry.timestamp} - ${message}`, error || '');
        // TODO: Send to error tracking service (Sentry/LogRocket)
    }

    // API-specific logging with sanitization
    api(route: string, data?: Record<string, any>) {
        if (this.isDevelopment && data) {
            // Sanitize: don't log full API responses or tokens
            const sanitized: Record<string, any> = {
                route,
                ...data
            };
            // Mask tags for privacy
            if (sanitized.tag) {
                sanitized.tag = `#${String(sanitized.tag).slice(0, 3)}***`;
            }
            this.debug('API Call', sanitized);
        }
    }
}

export const logger = new Logger();

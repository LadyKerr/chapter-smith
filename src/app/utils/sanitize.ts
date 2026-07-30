/**
 * Sanitize error details to prevent leaking sensitive information
 * (API keys, URLs with credentials, raw error bodies, tokens, etc.)
 */
export function sanitizeErrorDetails(details: unknown): unknown {
  if (!details || typeof details !== 'object') return details;

  const sensitiveKeys = [
    'url', 'errorBody', 'apiKey', 'key', 'token',
    'secret', 'password', 'authorization',
  ];
  const sanitized = { ...(details as Record<string, unknown>) };

  for (const key of sensitiveKeys) {
    if (key in sanitized) {
      delete sanitized[key];
    }
  }

  // Redact string values that look like they contain secrets
  for (const [key, value] of Object.entries(sanitized)) {
    if (typeof value === 'string' && containsSensitivePattern(value)) {
      sanitized[key] = '[redacted]';
    }
  }

  return Object.keys(sanitized).length > 0 ? sanitized : null;
}

/**
 * Check whether a string value matches known sensitive patterns
 */
function containsSensitivePattern(value: string): boolean {
  return (
    // URL query parameter with key
    /[?&]key=/.test(value) ||
    // Bearer tokens
    /Bearer\s+\S+/i.test(value) ||
    // Common API key prefixes (e.g. AIza for Google, sk- for OpenAI/Anthropic)
    /\b(AIza[A-Za-z0-9_-]{30,}|sk-[A-Za-z0-9_-]{20,})\b/.test(value)
  );
}

/**
 * WebKurierSecurity — Payload Sanitizer
 *
 * Назначение:
 * - Защита workflow / agents / HTTP steps от вредоносных payload
 * - Базовая очистка входных данных (JSON, text, form-data)
 * - Предотвращение:
 *   • XSS
 *   • Prototype Pollution
 *   • Command / Prompt Injection (базовый уровень)
 *
 * ВАЖНО:
 * - Это НЕ WAF и НЕ антивирус
 * - Это обязательный pre-check перед:
 *   http.request
 *   ai.prompt
 *   file upload
 *   webhook / mailhook
 */

const FORBIDDEN_KEYS = [
  "__proto__",
  "prototype",
  "constructor"
];

const FORBIDDEN_PATTERNS = [
  /<script[\s\S]*?>/gi,
  /<\/script>/gi,
  /javascript:/gi,
  /onerror\s*=/gi,
  /onload\s*=/gi,
  /<iframe/gi,
  /<object/gi,
  /<embed/gi,
  /eval\s*\(/gi,
  /Function\s*\(/gi,
  /process\.env/gi
];

/**
 * Проверка ключей объекта (защита от prototype pollution)
 */
function validateObjectKeys(obj, path = "") {
  for (const key of Object.keys(obj)) {
    if (FORBIDDEN_KEYS.includes(key)) {
      throw new Error(`Forbidden key detected: ${path}${key}`);
    }
    const value = obj[key];
    if (typeof value === "object" && value !== null) {
      validateObjectKeys(value, `${path}${key}.`);
    }
  }
}

/**
 * Очистка строки
 */
function sanitizeString(str) {
  let result = str;
  for (const pattern of FORBIDDEN_PATTERNS) {
    result = result.replace(pattern, "");
  }
  return result;
}

/**
 * Глубокая санитаризация payload
 */
function sanitizePayload(payload) {
  if (payload === null || payload === undefined) return payload;

  if (typeof payload === "string") {
    return sanitizeString(payload);
  }

  if (Array.isArray(payload)) {
    return payload.map(item => sanitizePayload(item));
  }

  if (typeof payload === "object") {
    validateObjectKeys(payload);
    const clean = {};
    for (const [key, value] of Object.entries(payload)) {
      clean[key] = sanitizePayload(value);
    }
    return clean;
  }

  // number, boolean, etc.
  return payload;
}

/**
 * Главная функция — точка входа
 *
 * @param {any} payload
 * @param {object} options
 * @returns {object}
 */
export function sanitizeIncomingPayload(payload, options = {}) {
  const {
    maxSizeBytes = 1024 * 1024, // 1 MB
    strict = true
  } = options;

  // Size check (best-effort)
  try {
    const size = Buffer.byteLength(JSON.stringify(payload), "utf8");
    if (size > maxSizeBytes) {
      throw new Error(`Payload too large: ${size} bytes`);
    }
  } catch (e) {
    if (strict) throw e;
  }

  try {
    const sanitized = sanitizePayload(payload);
    return {
      ok: true,
      payload: sanitized
    };
  } catch (error) {
    if (strict) {
      throw error;
    }
    return {
      ok: false,
      error: error.message
    };
  }
}

/**
 * Упрощённый хелпер для Core / Runner
 */
export function requireSanitizedPayload(payload) {
  const result = sanitizeIncomingPayload(payload, { strict: true });
  return result.payload;
}
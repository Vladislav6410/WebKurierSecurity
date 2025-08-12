// WebKurierSecurity.js - Security module example

// Списки шаблонов для обнаружения угроз и секретов (их можно расширять по мере необходимости)
const threatPatterns = [
  /<script[^>]*>.*<\/script>/i,      // Подозрительный встроенный скрипт (XSS)
  /\bSELECT\s+.*\bFROM\b/i,         // Примеры SQL-инъекции (по ключевым словам)
  /\bDROP\s+TABLE\b/i,              // Примеры деструктивного SQL-запроса
  /<img\s+src=["']javascript:/i     // Пример XSS через атрибут img
  // ... другие шаблоны угроз при необходимости
];
const secretPatterns = [
  /api[_-]?key\s*[:=]\s*['"][A-Za-z0-9-_]{16,}/i, // Примитивный поиск API-ключей (после "apiKey:" со строковым значением)
  /\bsecret\b\s*[:=]\s*['"][A-Za-z0-9]{8,}/i,     // Примитивный поиск строк, содержащих "secret" и последующее значение
  /\bAKIA[0-9A-Z]{16}\b/                         // Пример шаблона AWS Access Key (начинается с AKIA, 16 символов)
  // ... другие регулярные выражения для токенов/ключей
];

// Класс модуля безопасности
class WebKurierSecurity {
  constructor() {
    // Список "карантина" для изоляции подозрительных объектов
    this.quarantineList = [];
  }

  /**
   * Обнаруживает потенциальные угрозы в заданном тексте.
   * Ищет совпадения с известными шаблонами атак (XSS, SQL-инъекции и др.).
   * @param {string} inputData - Входные данные (например, пользовательский ввод или часть логов).
   * @returns {Array<string>} Массив описаний найденных угроз (если обнаружены).
   */
  detectThreats(inputData) {
    const foundThreats = [];

    // Проходим по всем шаблонам угроз и проверяем, есть ли совпадения
    for (const pattern of threatPatterns) {
      if (pattern.test(inputData)) {
        foundThreats.push(`Совпадение угрозы по шаблону: ${pattern.source}`);
      }
    }

    // Если найдены угрозы, добавляем событие в карантин (изолируем, например, входные данные)
    if (foundThreats.length > 0) {
      this.quarantine(inputData, `Обнаружены угрозы: ${foundThreats.join('; ')}`);
    }

    return foundThreats;
  }

  /**
   * Сканирует загруженный файл на наличие вредоносного содержимого.
   * Можно проверить тип файла, размер и сигнатуры известных вирусов.
   * @param {Object} file - Объект файла (предполагается, содержит поля name, content, size).
   * @returns {boolean} true, если файл помечен как вредоносный и помещён в карантин; false, если файл безопасен.
   */
  scanUploadedFile(file) {
    // Пример: проверка по расширению файла (не разрешаем исполняемые файлы) 
    const unsafeExtensions = ['.exe', '.bat', '.cmd', '.scr'];
    const fileName = file.name || 'unknown';
    const lowerName = fileName.toLowerCase();
    for (const ext of unsafeExtensions) {
      if (lowerName.endsWith(ext)) {
        // Исполняемый файл загружен – поместим в карантин
        this.quarantine(fileName, `Запрещённое расширение файла (${ext})`);
        return true; // файл небезопасен
      }
    }

    // Пример: проверка содержания файла на известную вирусную сигнатуру (для демонстрации)
    if (file.content) {
      // Например, сигнатура EICAR (тестовая антивирусная строка) или другое известное вредоносное содержимое
      if (typeof file.content === 'string' && file.content.includes('EICAR-STANDARD-ANTIVIRUS-TEST-FILE')) {
        this.quarantine(fileName, 'Обнаружена вирусная сигнатура (EICAR тест)');
        return true;
      }
      // Можно добавить другие проверки содержимого (например, по хешу или другим сигнатурам)
    }

    // Если дополнительных подозрений нет, считаем файл безопасным
    return false;
  }

  /**
   * Проверяет текст/код на наличие секретных токенов или ключей.
   * Найденные секреты маскируются, чтобы предотвратить утечку, и фиксируются инцидентом безопасности.
   * @param {string} text - Входной текст (например, исходный код или лог, потенциально содержащий секреты).
   * @returns {string} Обработанный текст с замаскированными секретными значениями.
   */
  protectTokens(text) {
    let protectedText = text;
    let secretsFound = false;

    for (const pattern of secretPatterns) {
      if (pattern.test(protectedText)) {
        secretsFound = true;
        // Маскируем все вхождения найденного шаблона в тексте
        protectedText = protectedText.replace(pattern, '[PROTECTED]');
      }
    }

    // Если найдены какие-либо секреты, добавляем запись о событии в карантин
    if (secretsFound) {
      this.quarantine('(text snippet)', 'Обнаружены и замаскированы секретные токены/ключи');
    }

    return protectedText;
  }

  /**
   * Помещает указанный объект в список карантина (изоляция).
   * Например, может использоваться для заражённых файлов или опасных фрагментов данных.
   * @param {any} item - Объект или описание, подлежащее карантину (например, имя файла или сам объект).
   * @param {string} reason - Причина помещения в карантин (описание угрозы).
   */
  quarantine(item, reason) {
    const timestamp = new Date().toISOString();
    // Сохраняем только необходимую информацию об объекте, чтобы избежать хранения вредоносных данных в чистом виде
    const record = {
      time: timestamp,
      item: typeof item === 'string' ? item.substring(0, 100) + (item.length > 100 ? '...' : '') : '<OBJECT>',
      reason: reason
    };
    this.quarantineList.push(record);
    // Дополнительно: в реальной реализации можно переместить файл в безопасное место или удалить,
    // а для строковых данных - очистить или обезвредить их в основной системе.
  }

  /**
   * Генерирует текстовый отчёт о срабатываниях системы безопасности.
   * В отчёте перечислены все объекты, помещённые в карантин, с указанием причин.
   * @returns {string} Многострочный текстовый отчёт.
   */
  generateReport() {
    if (this.quarantineList.length === 0) {
      return 'Отчёт безопасности: инцидентов не зафиксировано.';
    }
    let report = 'Отчёт безопасности WebKurierSecurity:\n';
    report += `Всего инцидентов: ${this.quarantineList.length}\n`;
    report += 'Детали:\n';
    for (const record of this.quarantineList) {
      report += `- [${record.time}] ${record.reason}; Объект: ${record.item}\n`;
    }
    return report;
  }
}

module.exports = WebKurierSecurity;

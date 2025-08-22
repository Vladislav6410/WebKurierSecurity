// engine/agents/security/adapter.js
// Адаптер для старого модуля WebKurierSecurity

const fs = require('fs');
const path = require('path');
const WebKurierSecurity = require('./legacy/WebKurierSecurity.js');

const quarantineDir = path.join(__dirname, '.quarantine');
const reportsDir = path.join(__dirname, '.reports');

// создаём служебные папки если нет
if (!fs.existsSync(quarantineDir)) fs.mkdirSync(quarantineDir, { recursive: true });
if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

const security = new WebKurierSecurity();

/**
 * Рекурсивный обход папки и проверка файлов
 */
function scanFolder(folderPath) {
  const files = fs.readdirSync(folderPath);
  for (const file of files) {
    const fullPath = path.join(folderPath, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanFolder(fullPath);
    } else {
      try {
        const content = fs.readFileSync(fullPath, 'utf-8');
        // Проверяем на угрозы и секреты
        security.detectThreats(content);
        security.protectTokens(content);
        // Проверяем загружаемый файл
        security.scanUploadedFile({ name: file, content });
      } catch (err) {
        console.error(`Ошибка чтения файла ${fullPath}:`, err.message);
      }
    }
  }
}

/**
 * Сохраняем отчёт
 */
function saveReport() {
  const reportText = security.generateReport();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPathTxt = path.join(reportsDir, `report-${timestamp}.txt`);
  fs.writeFileSync(reportPathTxt, reportText, 'utf-8');
  console.log(`✅ Отчёт сохранён: ${reportPathTxt}`);
}

/**
 * Основная CLI-логика
 */
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'scan':
    const target = args[1] || path.join(__dirname, '../../..'); // весь проект по умолчанию
    console.log(`🔍 Сканирую папку: ${target}`);
    scanFolder(target);
    saveReport();
    break;

  case 'quarantine':
    if (!args[1]) {
      console.error('❌ Укажите файл для карантина');
      process.exit(1);
    }
    const filePath = args[1];
    if (fs.existsSync(filePath)) {
      const fileName = path.basename(filePath);
      const destPath = path.join(quarantineDir, fileName);
      fs.renameSync(filePath, destPath);
      security.quarantine(fileName, 'Файл вручную помещён в карантин');
      saveReport();
      console.log(`⚠️ Файл ${fileName} перемещён в карантин`);
    } else {
      console.error(`❌ Файл ${filePath} не найден`);
    }
    break;

  case 'report':
    saveReport();
    break;

  default:
    console.log('Использование:');
    console.log('  node adapter.js scan [папка]   - сканировать проект');
    console.log('  node adapter.js quarantine [файл] - вручную поместить файл в карантин');
    console.log('  node adapter.js report         - сгенерировать отчёт');
    break;
}
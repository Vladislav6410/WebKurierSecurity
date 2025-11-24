// engine/agents/security/scanner.js
const fs = require('fs');
const fsp = fs.promises;
const path = require('path');

const SECRET_PATTERNS = [
  /api[_-]?key\s*=\s*["'][A-Za-z0-9_\-]{16,}["']/i,
  /secret\s*=\s*["'][A-Za-z0-9_\-]{16,}["']/i,
  /sk-[A-Za-z0-9]{20,}/,          // типичный OpenAI ключ
  /ghp_[A-Za-z0-9]{20,}/,         // GitHub personal access token
];

const SUSPICIOUS_FILENAMES = [
  '.env',
  '.env.local',
  'id_rsa',
  'id_rsa.pub',
  'id_ed25519',
  'id_ed25519.pub',
  'credentials.json',
  'service-account.json',
  'firebase-adminsdk.json',
  'cert.pem',
  'key.pem',
  'server.key',
  'server.crt',
];

async function scanPaths(repoRoot, scanPathsList, options = {}) {
  const exclude = options.exclude || [];
  const findings = [];

  for (const relScanPath of scanPathsList) {
    const absScanPath = path.resolve(repoRoot, relScanPath);
    await walk(absScanPath, repoRoot, exclude, findings);
  }

  return findings;
}

async function walk(currentPath, repoRoot, exclude, findings) {
  let stat;
  try {
    stat = await fsp.stat(currentPath);
  } catch (err) {
    return;
  }

  const rel = path.relative(repoRoot, currentPath) || '.';

  // исключения по каталогам
  const parts = rel.split(path.sep);
  if (parts.some((part) => exclude.includes(part))) {
    return;
  }

  if (stat.isDirectory()) {
    const entries = await fsp.readdir(currentPath);
    for (const e of entries) {
      await walk(path.join(currentPath, e), repoRoot, exclude, findings);
    }
  } else if (stat.isFile()) {
    await scanFile(currentPath, repoRoot, findings);
  }
}

async function scanFile(filePath, repoRoot, findings) {
  const rel = path.relative(repoRoot, filePath);
  const base = path.basename(filePath);

  // подозрительные имена файлов
  if (SUSPICIOUS_FILENAMES.includes(base)) {
    findings.push({
      type: 'suspicious_file_name',
      severity: 'critical',
      file: rel,
      message: `Suspicious filename: ${base}`,
    });
  }

  // читаем только "небольшие" файлы (до 1 МБ), чтобы не захлебнуться
  let content;
  try {
    const stat = await fsp.stat(filePath);
    if (stat.size > 1024 * 1024) {
      return;
    }
    content = await fsp.readFile(filePath, 'utf8');
  } catch {
    return;
  }

  // поиск токенов и секретов
  for (const pattern of SECRET_PATTERNS) {
    const match = content.match(pattern);
    if (match) {
      findings.push({
        type: 'secret_pattern',
        severity: 'critical',
        file: rel,
        message: `Possible secret detected: pattern ${pattern}`,
        snippet: match[0].slice(0, 120),
      });
    }
  }
}

module.exports = {
  scanPaths,
};
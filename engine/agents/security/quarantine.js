// engine/agents/security/quarantine.js
const fs = require('fs');
const fsp = fs.promises;
const path = require('path');

async function quarantineFindings(repoRoot, findings, quarantineDir) {
  if (!findings.length) return;

  const destRoot = path.resolve(quarantineDir);
  await ensureDir(destRoot);

  const uniqueFiles = new Set(
    findings
      .map((f) => f.file)
      .filter(Boolean)
  );

  for (const relFile of uniqueFiles) {
    const src = path.join(repoRoot, relFile);
    const dest = path.join(destRoot, relFile);

    try {
      await copyFileSafe(src, dest);
    } catch (err) {
      console.error('[Quarantine] Failed to copy', relFile, '→', err.message);
    }
  }

  console.log(`[Quarantine] Copied ${uniqueFiles.size} files to quarantine: ${path.relative(repoRoot, destRoot)}`);
}

async function ensureDir(dirPath) {
  await fsp.mkdir(dirPath, { recursive: true });
}

async function copyFileSafe(src, dest) {
  // не удаляем оригинал, только копируем
  await ensureDir(path.dirname(dest));
  if (!fs.existsSync(src)) return;
  await fsp.copyFile(src, dest);
}

module.exports = {
  quarantineFindings,
};
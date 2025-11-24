// engine/agents/security/reports.js
const fsp = require('fs').promises;
const path = require('path');

function nowStamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return (
    d.getFullYear().toString() +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    '_' +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    pad(d.getSeconds())
  );
}

async function writeReport(reportDir, findings, meta = {}) {
  await fsp.mkdir(reportDir, { recursive: true });
  const stamp = nowStamp();

  const jsonPath = path.join(reportDir, `security-report-${stamp}.json`);
  const txtPath = path.join(reportDir, `security-report-${stamp}.txt`);

  const payload = {
    generatedAt: new Date().toISOString(),
    meta,
    findingsCount: findings.length,
    findings,
  };

  await fsp.writeFile(jsonPath, JSON.stringify(payload, null, 2), 'utf8');
  await fsp.writeFile(txtPath, formatTextReport(payload), 'utf8');

  return [jsonPath, txtPath];
}

function formatTextReport(report) {
  const lines = [];
  lines.push('WebKurierSecurity – Security Report');
  lines.push(`Generated: ${report.generatedAt}`);
  if (report.meta && report.meta.scanPaths) {
    lines.push(`Scan paths: ${report.meta.scanPaths.join(', ')}`);
  }
  lines.push(`Findings: ${report.findingsCount}`);
  lines.push('='.repeat(60));

  if (!report.findingsCount) {
    lines.push('No issues detected.');
    return lines.join('\n');
  }

  for (const f of report.findings) {
    lines.push(`Type:      ${f.type}`);
    lines.push(`Severity:  ${f.severity || 'n/a'}`);
    lines.push(`File:      ${f.file || 'n/a'}`);
    if (f.message) lines.push(`Message:   ${f.message}`);
    if (f.snippet) lines.push(`Snippet:   ${f.snippet}`);
    lines.push('-'.repeat(60));
  }

  return lines.join('\n');
}

module.exports = {
  writeReport,
};
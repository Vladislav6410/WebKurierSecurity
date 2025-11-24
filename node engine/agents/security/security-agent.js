#!/usr/bin/env node
/**
 * WebKurierSecurity – main SecurityAgent
 *
 * Запуск:
 *   node engine/agents/security/security-agent.js
 *   node engine/agents/security/security-agent.js scan
 *   node engine/agents/security/security-agent.js scan ./src
 */

const path = require('path');
const fs = require('fs');
const { scanPaths } = require('./scanner');
const { quarantineFindings } = require('./quarantine');
const { writeReport } = require('./reports');

function resolveRepoRoot() {
  // __dirname = engine/agents/security
  return path.resolve(__dirname, '../../..');
}

function loadConfig() {
  const repoRoot = resolveRepoRoot();
  const configPath = path.join(repoRoot, 'config', 'settings.json');

  let baseConfig = {
    security: {
      enabled: true,
      scanPaths: ['.'],
      exclude: ['node_modules', '.git', 'bench', 'runs', '.github'],
      quarantineDir: 'engine/agents/security/quarantine',
      reportDir: 'engine/agents/security/reports',
      severityThreshold: 'warning' // info | warning | critical
    }
  };

  try {
    if (fs.existsSync(configPath)) {
      const raw = fs.readFileSync(configPath, 'utf8');
      const parsed = JSON.parse(raw);
      baseConfig = { ...baseConfig, ...parsed };
    }
  } catch (err) {
    console.error('[SecurityAgent] Failed to load config/settings.json, using defaults:', err.message);
  }

  return baseConfig.security || baseConfig;
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'scan';

  const repoRoot = resolveRepoRoot();
  const config = loadConfig();

  if (!config.enabled) {
    console.error('[SecurityAgent] Security module is disabled in config.settings.json (security.enabled = false)');
    process.exit(1);
  }

  if (command === 'scan') {
    const customPathArg = args[1];
    const scanPathsList = customPathArg
      ? [customPathArg]
      : (config.scanPaths && config.scanPaths.length ? config.scanPaths : ['.']);

    console.log('[SecurityAgent] Starting scan...');
    console.log('  Repo root:', repoRoot);
    console.log('  Scan paths:', scanPathsList.join(', '));
    console.log('  Exclude:', (config.exclude || []).join(', '));

    try {
      const findings = await scanPaths(repoRoot, scanPathsList, {
        exclude: config.exclude || [],
      });

      console.log(`[SecurityAgent] Scan completed. Findings: ${findings.length}`);

      // Карантин
      const quarantineDir = config.quarantineDir || 'engine/agents/security/quarantine';
      const quarantinePath = path.join(repoRoot, quarantineDir);
      await quarantineFindings(repoRoot, findings, quarantinePath);

      // Отчёт
      const reportDir = config.reportDir || 'engine/agents/security/reports';
      const reportPath = path.join(repoRoot, reportDir);
      const reportFiles = await writeReport(reportPath, findings, {
        repoRoot,
        scanPaths: scanPathsList,
      });

      console.log('[SecurityAgent] Reports written:');
      for (const f of reportFiles) {
        console.log('  -', path.relative(repoRoot, f));
      }

      if (findings.length === 0) {
        console.log('[SecurityAgent] No issues detected. ✅');
      } else {
        console.log('[SecurityAgent] Potential security issues detected. ⚠️ Check reports and quarantine.');
      }
    } catch (err) {
      console.error('[SecurityAgent] Scan failed:', err);
      process.exit(1);
    }
  } else if (command === 'help' || command === '--help' || command === '-h') {
    console.log(`
WebKurierSecurity – SecurityAgent

Usage:
  node engine/agents/security/security-agent.js [command] [path]

Commands:
  scan [path]     – scan repository or specific path (default)
  help            – show this help

Examples:
  node engine/agents/security/security-agent.js
  node engine/agents/security/security-agent.js scan
  node engine/agents/security/security-agent.js scan ./engine
`);
  } else {
    console.error('[SecurityAgent] Unknown command:', command);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
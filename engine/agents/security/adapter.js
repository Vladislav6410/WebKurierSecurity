// Адаптер вокруг legacy/WebKurierSecurity.js
const fs = require("fs");
const path = require("path");
const WebKurierSecurity = require("./legacy/WebKurierSecurity");

const QUARANTINE_DIR = path.join(__dirname, ".quarantine");
const REPORTS_DIR = path.join(__dirname, ".reports");
for (const p of [QUARANTINE_DIR, REPORTS_DIR]) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function scanFileWithLegacy(filePath, sec) {
  const findings = [];

  // 1) проверка файла методом scanUploadedFile
  const content =
    fs.existsSync(filePath) && fs.statSync(filePath).size <= 2 * 1024 * 1024
      ? fs.readFileSync(filePath, "utf8")
      : null;

  const unsafe = sec.scanUploadedFile({
    name: path.basename(filePath),
    content,
  });
  if (unsafe) {
    findings.push({
      type: "file-unsafe",
      path: filePath,
      reason: "legacy: scanUploadedFile",
      severity: "high",
    });
  }

  // 2) проверка содержимого на секреты/угрозы
  if (typeof content === "string") {
    const masked = sec.protectTokens(content);
    if (masked !== content) {
      findings.push({
        type: "secret",
        path: filePath,
        reason: "legacy: protectTokens",
        severity: "high",
      });
    }
    const threats = sec.detectThreats(content);
    if (threats.length) {
      findings.push({
        type: "threat",
        path: filePath,
        reason: threats.join("; "),
        severity: "high",
      });
    }
  }

  return findings;
}

async function scanDirectoryLegacy(rootDir) {
  const sec = new WebKurierSecurity();
  const findings = [];
  const stack = [rootDir];

  while (stack.length) {
    const cur = stack.pop();
    let entries = [];
    try {
      entries = fs.readdirSync(cur, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const e of entries) {
      const full = path.join(cur, e.name);
      if (e.isDirectory()) {
        if ([".git", "node_modules", ".venv", ".pytest_cache"].includes(e.name))
          continue;
        stack.push(full);
      } else if (e.isFile()) {
        findings.push(...scanFileWithLegacy(full, sec));
      }
    }
  }

  return { findings, reportText: sec.generateReport() };
}

function writeReportJSON(findings, outPath) {
  const dir = path.dirname(outPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    outPath,
    JSON.stringify(
      { createdAt: new Date().toISOString(), total: findings.length, findings },
      null,
      2
    ),
    "utf8"
  );
}

async function main() {
  const [, , cmd, arg1] = process.argv;

  switch ((cmd || "").toLowerCase()) {
    case "scan": {
      const target = arg1 ? path.resolve(arg1) : process.cwd();
      const { findings, reportText } = await scanDirectoryLegacy(target);
      const out = path.join(
        REPORTS_DIR,
        `legacy_${new Date().toISOString().replace(/[:.]/g, "-")}.json`
      );
      writeReportJSON(findings, out);
      const txt = out.replace(/\.json$/, ".txt");
      fs.writeFileSync(txt, reportText, "utf8");
      console.log(`✅ Legacy scan done. Findings: ${findings.length}`);
      console.log(`📝 Report JSON: ${out}`);
      console.log(`📝 Report TXT : ${txt}`);
      break;
    }

    case "quarantine": {
      const p = arg1 ? path.resolve(arg1) : null;
      if (!p) return console.log("Usage: node adapter.js quarantine <path>");
      if (!fs.existsSync(p)) return console.log("Not found:", p);
      const dst = path.join(QUARANTINE_DIR, path.basename(p));
      let i = 1;
      let out = dst;
      while (fs.existsSync(out)) out = `${dst}.${i++}`;
      fs.renameSync(p, out);
      console.log("🛑 Moved to quarantine:", out);
      break;
    }

    case "report": {
      const out = arg1
        ? path.resolve(arg1)
        : path.join(REPORTS_DIR, "legacy_empty.json");
      writeReportJSON([], out);
      console.log("📝 Empty legacy report:", out);
      break;
    }

    default:
      console.log(
        [
          "Legacy Security adapter commands:",
          "  node engine/agents/security/adapter.js scan [path]",
          "  node engine/agents/security/adapter.js quarantine <path>",
          "  node engine/agents/security/adapter.js report [outPath]",
        ].join("\n")
      );
  }
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

module.exports = { scanDirectoryLegacy };
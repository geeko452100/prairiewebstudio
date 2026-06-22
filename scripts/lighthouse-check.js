const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const reportPath = path.join(root, 'lighthouse-report.json');
const url = process.env.LIGHTHOUSE_URL || 'http://localhost:3456';
const categories = ['performance', 'accessibility', 'best-practices', 'seo'];

function sleep(ms) {
  spawnSync('sleep', [String(Math.max(1, Math.ceil(ms / 1000)))]);
}

function startServer() {
  const port = new URL(url).port || '3456';
  const server = spawn('npx', ['--yes', 'serve', '-l', port, '.'], {
    cwd: root,
    detached: true,
    stdio: 'ignore',
  });
  server.unref();

  const deadline = Date.now() + 15000;
  while (Date.now() < deadline) {
    const probe = spawnSync('curl', ['-s', '-o', '/dev/null', '-w', '%{http_code}', url], {
      encoding: 'utf8',
    });
    if (probe.stdout === '200') {
      return server.pid;
    }
    sleep(250);
  }

  console.error(`Static server did not become ready at ${url}`);
  process.exit(1);
}

function stopServer(pid) {
  if (!pid) return;
  try {
    process.kill(-pid, 'SIGTERM');
  } catch {
    try {
      process.kill(pid, 'SIGTERM');
    } catch {
      // Server may already be stopped.
    }
  }
}

function runLighthouse() {
  const args = [
    '--yes',
    'lighthouse',
    url,
    '--only-categories=' + categories.join(','),
    '--form-factor=mobile',
    '--screenEmulation.mobile=true',
    '--output=json',
    '--output-path=' + reportPath,
    '--chrome-flags=--headless --no-sandbox --disable-gpu',
    '--quiet',
  ];

  const result = spawnSync('npx', args, { cwd: root, stdio: 'inherit' });
  if (result.status !== 0) {
    console.error('Lighthouse failed to run.');
    process.exit(result.status || 1);
  }
}

function assertScores() {
  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  const failures = [];

  for (const categoryId of categories) {
    const category = report.categories[categoryId];
    const score = category ? category.score : null;
    const pct = score === null ? 'n/a' : Math.round(score * 100);
    console.log(`${categoryId}: ${pct}`);

    if (score !== 1) {
      failures.push(`${categoryId} scored ${pct} (expected 100)`);
    }
  }

  if (failures.length) {
    console.error('\nLighthouse score check failed:');
    failures.forEach((line) => console.error(`- ${line}`));
    process.exit(1);
  }

  console.log('\nAll Lighthouse categories scored 100.');
}

const reuseServer = process.env.LIGHTHOUSE_REUSE_SERVER === '1';
const serverPid = reuseServer ? null : startServer();

try {
  runLighthouse();
  assertScores();
} finally {
  if (!reuseServer) {
    stopServer(serverPid);
  }
}

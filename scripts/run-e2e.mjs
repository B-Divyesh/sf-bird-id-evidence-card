import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const cli = fileURLToPath(new URL('../node_modules/@playwright/test/cli.js', import.meta.url));
const forwarded = process.argv.slice(2);
const runs = forwarded.length
  ? [forwarded]
  : Array.from({ length: 4 }, (_, index) => [`--shard=${index + 1}/4`]);

for (const run of runs) {
  const result = spawnSync(process.execPath, [cli, 'test', ...run], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

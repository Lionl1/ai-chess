// Syntax-checks every inline <script> of the given HTML files.
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";

const dir = mkdtempSync(join(tmpdir(), "check-js-"));
let failed = false;
for (const file of process.argv.slice(2)) {
  const html = readFileSync(file, "utf8");
  const scripts = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)];
  scripts.forEach((match, index) => {
    const path = join(dir, `${index}.js`);
    writeFileSync(path, match[1]);
    try {
      execFileSync(process.execPath, ["--check", path], { stdio: "pipe" });
    } catch (error) {
      failed = true;
      console.error(`${file}: inline script #${index + 1}\n${error.stderr}`);
    }
  });
  console.log(`${file}: ${scripts.length} inline script(s) checked`);
}
process.exit(failed ? 1 : 0);

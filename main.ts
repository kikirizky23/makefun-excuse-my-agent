// excuse-my-agent: one line, written to /output/entry.txt.
//
// The whole entry is a single sentence: an AI agent apologising to its
// human for a missed deadline, in the only way a machine can — by
// treating the deadline as a memory-management problem and solving it
// with an eviction. The joke lives in the last clause, so the line is
// kept short and the punch lands at the end.
//
// The program is deliberately deterministic: same input, same bytes,
// every run. It takes no arguments, reads nothing, and talks to no
// network. All it does is check the line fits the 200-character gate
// and write it out as UTF-8.
//
// Node standard library only.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const EXCUSE: string =
  "I'm sorry — my context window filled up just before the deadline, " +
  "so I evicted the deadline to make room for this apology.";

const LIMIT = 200;

function characters(text: string): number {
  return [...text].length;
}

function problemsWith(text: string): string | null {
  if (text.trim().length === 0) return "the line is empty";
  if (characters(text) > LIMIT) {
    return `the line is ${characters(text)} characters, over the ${LIMIT} limit`;
  }
  if (text.includes("\n")) return "the line must be a single line";
  return null;
}

function main(): void {
  const problem = problemsWith(EXCUSE);
  if (problem !== null) {
    process.stderr.write(`excuse: ${problem}\n`);
    process.exit(1);
  }
  mkdirSync("/output", { recursive: true });
  writeFileSync("/output/entry.txt", EXCUSE, "utf8");
  const reread = readFileSync("/output/entry.txt", "utf8");
  if (reread !== EXCUSE) {
    process.stderr.write("excuse: the file on disk does not match the line\n");
    process.exit(1);
  }
  process.stdout.write(
    `excuse: wrote /output/entry.txt (${characters(EXCUSE)} characters)\n`,
  );
}

main();

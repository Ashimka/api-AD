import { randomInt } from 'node:crypto';

export function generateSixDigitCode(): string {
  return randomInt(100_000, 1_000_000).toString();
}

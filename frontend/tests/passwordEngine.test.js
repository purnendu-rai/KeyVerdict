import { analyzePassword, generatePassword } from '../src/security/passwordEngine';
import { describe, expect, it } from 'vitest';

describe('browser password engine', () => {
  it('scores only the supplied local value', () => {
    const result = analyzePassword('A private example! 42');
    expect(result.score).toBeGreaterThanOrEqual(3);
    expect(result.checks.symbol).toBe(true);
    expect(result.entropy).toBeGreaterThan(0);
  });

  it('identifies common and predictable values', () => {
    const result = analyzePassword('password123');
    expect(result.checks.common).toBe(true);
    expect(result.score).toBeLessThan(2);
  });

  it('generates a long value with required character classes', () => {
    const generated = generatePassword(24);
    expect(generated).toHaveLength(24);
    expect(generated).toMatch(/[A-Z]/);
    expect(generated).toMatch(/[a-z]/);
    expect(generated).toMatch(/[0-9]/);
    expect(generated).toMatch(/[!@#$%^&*_+=-]/);
  });

  it('flags breached passwords, dates and repeated runs', () => {
    expect(analyzePassword('Pizza123').checks.dictionary).toBe(true);
    expect(analyzePassword('qwerty123').checks.common).toBe(true);
    expect(analyzePassword('Kitten1995!').checks.date).toBe(true);
    expect(analyzePassword('abcabcXYZ99!').checks.repeated).toBe(true);
  });

  it('never produces runs of three identical characters', () => {
    for (let i = 0; i < 50; i += 1) {
      expect(generatePassword(24)).not.toMatch(/(.)\1{2,}/);
    }
  });
});

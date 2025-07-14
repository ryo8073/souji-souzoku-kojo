import { describe, it, expect } from 'vitest';
import { Calculator } from './calculator.js';

describe('Calculator', () => {
  it('should correctly calculate the successive inheritance deduction based on the example case', () => {
    // Values from the reference image (image.jpg)
    const values = {
      A: 17000000,
      B: 82000000,
      C: 484000000,
      D: 280000000,
      E: 5,
    };

    // The expected result from the reference image
    const expectedAmount = 4917250;

    const result = Calculator.calculateDeduction(values);

    // The final amount should be floored, as per the calculation rules.
    const actualAmount = Math.floor(result.finalAmount);

    expect(actualAmount).toBe(expectedAmount);
  });

  it('should return 0 if the elapsed years (E) are 10 or more', () => {
    const values = {
      A: 17000000,
      B: 82000000,
      C: 484000000,
      D: 280000000,
      E: 10, // 10 years
    };
    const result = Calculator.calculateDeduction(values);
    expect(result.finalAmount).toBe(0);
  });

  it('should cap the ratio C/(B-A) at 1.0', () => {
    const values = {
      A: 10000000,
      B: 20000000,
      C: 30000000, // This makes C / (B-A) = 3, which should be capped at 1
      D: 15000000,
      E: 5,
    };
    
    // Calculation should be: 10M * 1.0 * (15M / 30M) * (5 / 10) = 2,500,000
    const expectedAmount = 2500000;
    const result = Calculator.calculateDeduction(values);
    const actualAmount = Math.floor(result.finalAmount);

    expect(actualAmount).toBe(expectedAmount);
  });
  
  it('should return 0 if B - A is zero or negative', () => {
    const values = {
      A: 20000000,
      B: 20000000, // B-A is zero
      C: 484000000,
      D: 280000000,
      E: 5,
    };
    const result = Calculator.calculateDeduction(values);
    expect(result.finalAmount).toBe(0);
  });
}); 
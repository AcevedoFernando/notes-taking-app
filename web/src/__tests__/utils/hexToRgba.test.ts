import { describe, it, expect } from 'vitest';
import { hexToRgba } from '../../utils/hexToRgba';

describe('hexToRgba', () => {
  it('converts a standard hex color to rgba', () => {
    expect(hexToRgba('#ff0000', 1)).toBe('rgba(255, 0, 0, 1)');
  });

  it('handles hex without # prefix', () => {
    expect(hexToRgba('00ff00', 1)).toBe('rgba(0, 255, 0, 1)');
  });

  it('applies the given alpha value', () => {
    expect(hexToRgba('#0000ff', 0.5)).toBe('rgba(0, 0, 255, 0.5)');
  });

  it('handles alpha of 0', () => {
    expect(hexToRgba('#ffffff', 0)).toBe('rgba(255, 255, 255, 0)');
  });

  it('handles lowercase hex', () => {
    expect(hexToRgba('#a3b4c5', 0.8)).toBe('rgba(163, 180, 197, 0.8)');
  });

  it('handles uppercase hex', () => {
    expect(hexToRgba('#A3B4C5', 1)).toBe('rgba(163, 180, 197, 1)');
  });

  it('handles black (#000000)', () => {
    expect(hexToRgba('#000000', 1)).toBe('rgba(0, 0, 0, 1)');
  });

  it('handles white (#ffffff)', () => {
    expect(hexToRgba('#ffffff', 1)).toBe('rgba(255, 255, 255, 1)');
  });
});

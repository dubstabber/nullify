import { describe, it, expect } from 'vitest';
import { cn } from '../utils';
describe('Utils', () => {
  describe('cn function', () => {
    it('should merge class names correctly', () => {
      expect(cn('foo', 'bar')).toBe('foo bar');
      expect(cn('foo', { bar: true })).toBe('foo bar');
      expect(cn('foo', { bar: false })).toBe('foo');
      expect(cn('foo', ['bar', 'baz'])).toBe('foo bar baz');
    });
    it('should handle conditional classes', () => {
      const isPrimary = true;
      const isSecondary = false;
      const result = cn(
        'base-class',
        isPrimary && 'primary',
        isSecondary && 'secondary'
      );
      expect(result).toBe('base-class primary');
    });
    it('should resolve conflicting classes using tailwind-merge', () => {
      const result = cn('px-2 py-1 text-red-500', 'p-4 text-blue-500');
      expect(result).toBe('p-4 text-blue-500');
    });
    it('should handle complex nested structures', () => {
      const result = cn(
        'base',
        [
          'nested-1',
          ['deeply-nested-1', 'deeply-nested-2'],
          { 'conditional-1': true, 'conditional-2': false }
        ],
        { 'top-level-conditional': true }
      );
      expect(result).toBe('base nested-1 deeply-nested-1 deeply-nested-2 conditional-1 top-level-conditional');
    });
    it('should handle undefined and null inputs', () => {
      expect(cn('foo', undefined, 'bar')).toBe('foo bar');
      expect(cn('foo', null, 'bar')).toBe('foo bar');
      const undefinedValue = undefined;
      expect(cn('foo', undefinedValue && 'ignored')).toBe('foo');
    });
  });
});

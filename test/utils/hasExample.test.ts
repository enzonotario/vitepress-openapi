import {describe, it, expect} from 'vitest';
import {hasExample} from "../../src/utils/hasExample";

describe('hasExample', () => {
  it('returns true if schema has an example at the root level', () => {
    const schema = { example: 'exampleValue' };
    expect(hasExample(schema)).toBe(true);
  });

  it('returns true if schema has an example in properties', () => {
    const schema = {
      properties: {
        prop1: { example: 'exampleValue' },
      },
    };
    expect(hasExample(schema)).toBe(true);
  });

  it('returns true if schema has an example in nested properties', () => {
    const schema = {
      properties: {
        prop1: {
          properties: {
            nestedProp: { example: 'exampleValue' },
          },
        },
      },
    };
    expect(hasExample(schema)).toBe(true);
  });

  it('returns true if schema has an example in items', () => {
    const schema = {
      items: { example: 'exampleValue' },
    };
    expect(hasExample(schema)).toBe(true);
  });

  it('returns true if schema has an example in nested items', () => {
    const schema = {
      items: {
        items: { example: 'exampleValue' },
      },
    };
    expect(hasExample(schema)).toBe(true);
  });

  it('returns false if schema has no example', () => {
    const schema = {
      properties: {
        prop1: {},
      },
    };
    expect(hasExample(schema)).toBe(false);
  });

  it('returns false if schema is empty', () => {
    const schema = {};
    expect(hasExample(schema)).toBe(false);
  });

  it('returns false if schema is null', () => {
    const schema = null;
    expect(hasExample(schema)).toBe(false);
  });

  it('returns false if schema is undefined', () => {
      const schema = undefined;
      expect(hasExample(schema)).toBe(false);
    });
});

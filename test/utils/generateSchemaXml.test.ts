import { describe, it, expect } from 'vitest';
import { generateSchemaXml, formatXml } from '../../src/lib/generateSchemaXml';

describe('generateSchemaXml', () => {
  it('generates XML for a simple schema', () => {
    const schema = { type: 'string' };
    const result = generateSchemaXml(schema);
    expect(result).toBe(formatXml('<root>string</root>'));
  });

  it('generates XML for a schema with properties', () => {
    const schema = {
      properties: {
        name: { type: 'string' },
        age: { type: 'number' },
      },
    };
    const result = generateSchemaXml(schema);
    expect(result).toBe(formatXml('<root><name>string</name><age>0</age></root>'));
  });

  it('generates XML for a schema with nested objects', () => {
    const schema = {
      properties: {
        person: {
          properties: {
            name: { type: 'string' },
            age: { type: 'number' },
          },
        },
      },
    };
    const result = generateSchemaXml(schema);
    expect(result).toBe(formatXml('<root><person><name>string</name><age>0</age></person></root>'));
  });

  it('generates XML for a schema with arrays', () => {
    const schema = {
      properties: {
        items: {
          type: 'array',
          items: { type: 'string' },
        },
      },
    };
    const result = generateSchemaXml(schema);
    expect(result).toBe(formatXml('<root><items><item>string</item></items></root>'));
  });

  it('generates XML using examples if provided', () => {
    const schema = {
      properties: {
        name: { type: 'string', example: 'John Doe' },
        age: { type: 'number', example: 30 },
      },
    };
    const result = generateSchemaXml(schema, true);
    expect(result).toBe(formatXml('<root><name>John Doe</name><age>30</age></root>'));
  });

  it('handles empty schema gracefully', () => {
    const schema = {};
    const result = generateSchemaXml(schema);
    expect(result).toBe(formatXml('<root></root>'));
  });

  it('handles schema with no properties', () => {
    const schema = { type: 'object' };
    const result = generateSchemaXml(schema);
    expect(result).toBe(formatXml('<root></root>'));
  });
});

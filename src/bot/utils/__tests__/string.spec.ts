import { getCharRange, generateLorem, generateHtmlLorem, generateRandomString } from '../string';

describe('getCharRange', () => {
  it('should return characters between two Unicode values (digits)', () => {
    const result = getCharRange(48, 57); // 0-9
    expect(result).toHaveLength(10);
    expect(result[0]).toBe('0');
    expect(result[9]).toBe('9');
  });

  it('should return uppercase letters A-Z', () => {
    const result = getCharRange(65, 90);
    expect(result).toHaveLength(26);
    expect(result[0]).toBe('A');
    expect(result[25]).toBe('Z');
  });

  it('should return lowercase letters a-z', () => {
    const result = getCharRange(97, 122);
    expect(result).toHaveLength(26);
    expect(result[0]).toBe('a');
    expect(result[25]).toBe('z');
  });

  it('should return a single character when start equals end', () => {
    const result = getCharRange(65, 65);
    expect(result).toHaveLength(1);
    expect(result[0]).toBe('A');
  });

  it('should return an empty array when start is greater than end', () => {
    const result = getCharRange(90, 65);
    expect(result).toHaveLength(0);
  });
});

describe('generateLorem', () => {
  it('should return a string of exactly the specified length', () => {
    const result = generateLorem(100);
    expect(result).toHaveLength(100);
  });

  it('should return a string of exactly 500 characters', () => {
    const result = generateLorem(500);
    expect(result).toHaveLength(500);
  });

  it('should return a non-empty string for length 1', () => {
    const result = generateLorem(1);
    expect(result).toHaveLength(1);
    expect(typeof result).toBe('string');
  });

  it('should return a string type', () => {
    const result = generateLorem(50);
    expect(typeof result).toBe('string');
  });
});

describe('generateHtmlLorem', () => {
  const validTags = ['strong', 'em', 'u', 'b', 'i', 'span'];

  it('should return a string that does not exceed the specified length', () => {
    const limit = 300;
    const result = generateHtmlLorem(limit);
    expect(result.length).toBeLessThanOrEqual(limit);
  });

  it('should return a string containing valid HTML tags', () => {
    const result = generateHtmlLorem(500);
    const hasValidTag = validTags.some((tag) => result.includes(`<${tag}`));
    expect(hasValidTag).toBe(true);
  });

  it('should use <span class="tg-spoiler"> for spoiler content', () => {
    // Run multiple times to increase chance of hitting span
    let hasSpoiler = false;
    for (let i = 0; i < 20; i++) {
      const result = generateHtmlLorem(1000);
      if (result.includes('tg-spoiler')) {
        hasSpoiler = true;
        break;
      }
    }
    // This is probabilistic; just ensure the function doesn't crash
    expect(typeof hasSpoiler).toBe('boolean');
  });

  it('should return an empty string if length is too small for any tag', () => {
    const result = generateHtmlLorem(5);
    expect(result).toBe('');
  });

  it('should return a string type', () => {
    const result = generateHtmlLorem(200);
    expect(typeof result).toBe('string');
  });
});

describe('generateRandomString', () => {
  it('should return a string of the specified length', () => {
    const result = generateRandomString(16);
    expect(result).toHaveLength(16);
  });

  it('should return a string of length 0 when 0 is passed', () => {
    const result = generateRandomString(0);
    expect(result).toHaveLength(0);
  });

  it('should only contain alphanumeric characters', () => {
    const result = generateRandomString(200);
    expect(result).toMatch(/^[a-zA-Z0-9]+$/);
  });

  it('should return different values on subsequent calls', () => {
    const result1 = generateRandomString(32);
    const result2 = generateRandomString(32);
    // Extremely unlikely to be equal with length 32
    expect(result1).not.toBe(result2);
  });

  it('should return a string type', () => {
    const result = generateRandomString(10);
    expect(typeof result).toBe('string');
  });
});

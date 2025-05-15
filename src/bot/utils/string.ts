import _ from 'lodash';
import { faker } from '@faker-js/faker';

/**
 * Generates a range of characters between the specified Unicode values.
 * @param start - Unicode value of the start character.
 * @param end - Unicode value of the end character.
 * @returns An array of characters within the specified range.
 */
export const getCharRange = (start: number, end: number) => {
  return Array.from({ length: end - start + 1 }, (_, i) => String.fromCharCode(start + i));
};

/**
 * Generates a random Lorem Ipsum text with the specified length.
 * @param length - The desired length of the generated Lorem Ipsum text.
 * @returns A string containing Lorem Ipsum text of the specified length.
 */
export const generateLorem = (length: number) => {
  let result = '';

  while (result.length < length) {
    result += faker.lorem.paragraph() + ' ';
  }

  return result.slice(0, length);
};

/**
 * Generates a random Lorem Ipsum text with HTML tags, such as <strong>, <em>, etc.
 * @param length - The desired length of the generated HTML-formatted Lorem Ipsum text.
 * @returns A string containing HTML-formatted Lorem Ipsum text of the specified length.
 */
export const generateHtmlLorem = (length: number) => {
  const htmlTags = ['strong', 'em', 'u', 'b', 'i', 'span'];
  let result = '';

  while (true) {
    const tag = faker.helpers.arrayElement(htmlTags);
    const content = faker.lorem.sentence();

    let wrapped;

    if (tag === 'span') {
      wrapped = `<span class="tg-spoiler">${content}</span>\n`;
    } else {
      wrapped = `<${tag}>${content}</${tag}>\n`;
    }

    if (result.length + wrapped.length > length) break;

    result += wrapped;
  }

  return result;
};

/**
 * Generates a random alphanumeric string of the specified length.
 * @param length - The desired length of the generated random string.
 * @returns A string containing random alphanumeric characters.
 */
export const generateRandomString = (length: number) => {
  const chars = [
    ...getCharRange(48, 57), // 0-9
    ...getCharRange(65, 90), // A-Z
    ...getCharRange(97, 122), // a-z
  ];

  return _.times(length, () => _.sample(chars)).join('');
};

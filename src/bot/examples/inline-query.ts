import { Markup } from 'telegraf';
import { InlineQueryResultArticle, InlineQueryResultPhoto } from 'telegraf/types';
import { faker } from '@faker-js/faker';
import { generateHtmlLorem } from '@/bot/utils';

export const inlineQueryArticles = Array.from({ length: 6 }, (_, i) => {
  const { reply_markup } = Markup.inlineKeyboard([
    [
      Markup.button.callback('Option 1', `example-1-article-${i + 1}-option-1`),
      Markup.button.callback('Option 2', `example-1-article-${i + 1}-option-2`),
    ],
    [
      Markup.button.callback('Other 1', `example-1-article-${i + 1}-other-1`),
      Markup.button.callback('Other 2', `example-1-article-${i + 1}-other-2`),
    ],
    [Markup.button.callback('More Option', `example-1-article-${i + 1}-more`)],
  ]);
  const imageUrl = faker.image.url({ height: 400, width: 400 });
  const article: InlineQueryResultArticle = {
    id: `example-1-article-${i + 1}`,
    type: 'article',
    title: `Inline Query Article ${i + 1}`,
    description: `Description of article ${i + 1}`,
    input_message_content: {
      message_text: `This an example of <span class="tg-spoiler">article ${i + 1}</span>\n\n${generateHtmlLorem(400)}`,
      parse_mode: 'HTML',
      link_preview_options: {
        is_disabled: false,
        url: imageUrl,
      },
    },
    thumbnail_url: imageUrl,
    reply_markup,
  };

  return article;
});

export const inlineQueryPhotos = Array.from({ length: 6 }, (_, i) => {
  const { reply_markup } = Markup.inlineKeyboard([
    [
      Markup.button.callback('Option 1', `example-1-photo-${i + 1}-option-1`),
      Markup.button.callback('Option 2', `example-1-photo-${i + 1}-option-2`),
    ],
    [
      Markup.button.callback('Other 1', `example-1-photo-${i + 1}-other-1`),
      Markup.button.callback('Other 2', `example-1-photo-${i + 1}-other-2`),
    ],
    [Markup.button.callback('More Option', `example-1-photo-${i + 1}-more`)],
  ]);

  // A valid URL of the photo. Photo must be in JPEG format. Photo size must not exceed 5MB
  const photo_url = 'https://loremflickr.com/cache/resized/defaultImage.small_320_240_g.jpg';
  const thumbnail_url = faker.image.urlPicsumPhotos({
    width: 100,
    height: 100,
  });
  const photo: InlineQueryResultPhoto = {
    id: `example-1-photo-${i + 1}`,
    type: 'photo',
    title: `Inline Query Photo ${i + 1}`,
    caption: `Photo caption ${i + 1}`,
    description: `Description of photo ${i + 1}`,
    input_message_content: {
      message_text: `This an example of <span class="tg-spoiler">photo ${i + 1}</span>\n\n${generateHtmlLorem(400)}`,
      parse_mode: 'HTML',
      link_preview_options: {
        is_disabled: false,
        url: thumbnail_url,
      },
    },
    photo_url,
    thumbnail_url,
    reply_markup,
  };

  return photo;
});

import { Composer, Scenes, Markup } from 'telegraf';
import { message } from 'telegraf/filters';
import { encode as htmlEncode } from 'html-entities';
import { MyContext } from '@/types';

const composer = new Composer<MyContext>();
const { BaseScene, Stage } = Scenes;

// Define a BaseScene for example 3
const scene = new BaseScene<MyContext>('exampleBaseScene1');

/**
 * Reply keyboard presented on the first step of the form
 */
const openingKeyboard = Markup.keyboard([['✅ Yes', '❌ No']])
  .resize()
  .oneTime()
  .placeholder('Pick your answer');

/**
 * Triggered when the user enters the scene
 * Initializes session data and presents the first question
 */
scene.enter(async (ctx) => {
  ctx.scene.session.exampleBaseScene1 = {
    currentStep: 0,
  };

  await ctx.reply(
    `
👋 Welcome to <b>Base Scene Example 1</b>!

This is a multi-step form where we’ll collect a few responses from you.

🔙 <b>/back</b> — Go back  
❌ <b>/cancel</b> — Cancel the flow  
❓ <b>/help</b> — Show this help again

Let’s start with a quick question 👇
✅ Yes / ❌ No
    `.trim(),
    {
      parse_mode: 'HTML',
      ...openingKeyboard,
    },
  );
});

/**
 * Command: /cancel — exit the scene immediately
 */
scene.command('cancel', async (ctx) => {
  ctx.scene.session.exampleBaseScene1.stepCanceled = true;
  await ctx.scene.leave();
});

/**
 * Command: /back — return to the previous question
 */
scene.command('back', async (ctx) => {
  const session = ctx.scene.session.exampleBaseScene1;

  if (session.currentStep === 0) {
    await ctx.reply('⚠️ You are already at the beginning.');
    return;
  }

  session.currentStep--;

  switch (session.currentStep) {
    case 0:
      return ctx.reply('✅ Yes / ❌ No', openingKeyboard);
    case 1:
      return ctx.reply('📍 Step 1: What’s your name?');
    case 2:
      return ctx.reply('📍 Step 2: What do you do for a living?');
    case 3:
      return ctx.reply('📍 Step 3: What’s your favorite hobby?');
  }
});

/**
 * Command: /help — show usage instructions for this scene
 */
scene.command('help', async (ctx) => {
  await ctx.reply(
    `
❓ <b>Help — Base Scene Example 1</b>

This flow collects input step-by-step.
You can use the following commands to navigate:

🔙 /back — Go to previous question  
❌ /cancel — Cancel the form  
🚀 /example3 — Restart from beginning
    `.trim(),
    { parse_mode: 'HTML' },
  );
});

/**
 * Text handler — progresses the user through the steps of the form
 */
scene.on(message('text'), async (ctx) => {
  const session = ctx.scene.session.exampleBaseScene1;

  switch (session.currentStep) {
    // Step 0: Yes/No confirmation
    case 0: {
      const valid = ['✅ Yes', '❌ No'];
      if (!valid.includes(ctx.message.text)) {
        return ctx.reply('Please answer with ✅ Yes or ❌ No', openingKeyboard);
      }

      session.step0Answer = ctx.message.text;
      session.currentStep++;
      return ctx.reply('📍 Step 1: What’s your name?', Markup.removeKeyboard());
    }

    // Step 1: Ask for name
    case 1:
      session.step1Answer = ctx.message.text;
      session.currentStep++;
      return ctx.reply('📍 Step 2: What do you do for a living?');

    // Step 2: Ask for occupation
    case 2:
      session.step2Answer = ctx.message.text;
      session.currentStep++;
      return ctx.reply('📍 Step 3: What’s your favorite hobby?');

    // Step 3: Ask for hobby
    case 3:
      session.step3Answer = ctx.message.text;
      session.currentStep++;
      return ctx.reply('📍 Step 4: Any feedback or message for us?');

    // Step 4: Final step (feedback)
    case 4:
      session.step4Answer = ctx.message.text;
      session.stepCompleted = true;
      await ctx.scene.leave();
      return;
  }
});

/**
 * Triggered when the user leaves the scene
 * If the form was completed, display a summary; otherwise, notify cancellation
 */
scene.leave(async (ctx) => {
  const session = ctx.scene.session.exampleBaseScene1;

  if (session.stepCompleted && !session.stepCanceled) {
    const data = {
      step0Answer: session.step0Answer,
      step1Answer: session.step1Answer,
      step2Answer: session.step2Answer,
      step3Answer: session.step3Answer,
      step4Answer: session.step4Answer,
    };

    const summary = htmlEncode(JSON.stringify(data, null, 2));
    await ctx.reply(
      '<tg-spoiler>🎉 You’ve successfully completed the form!</tg-spoiler>\n\n' +
        'Here’s a summary of your responses:\n' +
        `<pre><code class="json">${summary}</code></pre>`,
      { parse_mode: 'HTML' },
    );
  } else {
    await ctx.reply('❌ Scene canceled or exited early.');
  }
});

/**
 * Register the base scene in the stage and activate it on /example3
 */
const baseScene = new Stage<MyContext>([scene]);
composer.use(baseScene.middleware());

composer.command('example3', async (ctx) => {
  await ctx.scene.enter('exampleBaseScene1');
});

export default composer;

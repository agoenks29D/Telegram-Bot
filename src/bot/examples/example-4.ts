import { Composer, Markup, Scenes } from 'telegraf';
import { encode as htmlEncode } from 'html-entities';
import { withTextMessage } from '@/bot/helpers';
import { MyContext } from '@/types';
import { sleep } from '@/utils';

const openingMessage = `
👋 Welcome to <b>Wizard Scene Example 1</b>!

This is a multi-step form where we’ll collect a few responses from you.
You can navigate through the steps using the following commands:

🔙 <b>/back</b> — Go back to the previous step  
❌ <b>/cancel</b> — Cancel the wizard at any time  
❓ <b>/help</b> — Show this help message again

Let's start with a quick question 👇
`;

const openingKeyboard = Markup.keyboard([
  [Markup.button.text('✅ Yes'), Markup.button.text('❌ No')],
])
  .resize()
  .oneTime()
  .placeholder('Pick your answer');

const { WizardScene } = Scenes;
const composer = new Composer<MyContext>();

/**
 * Wizard scene definition for "exampleWizard1"
 * Guides the user through a series of steps, collecting input at each stage.
 */
const exampleWizard = new WizardScene<MyContext>(
  'exampleWizard1',

  // Step 0: Yes/No question
  withTextMessage(async (ctx) => {
    const answer = ['✅ Yes', '❌ No'];

    if (!answer.includes(ctx.message.text)) {
      return await ctx.reply(
        "Please reply with your answer: '✅ Yes' or '❌ No'.",
        openingKeyboard,
      );
    }

    ctx.scene.session.exampleWizard1.step0Answer = ctx.message.text;
    await ctx.reply('📍 <b>Step 1:</b> What’s your name?', {
      parse_mode: 'HTML',
      ...Markup.removeKeyboard(),
    });
    return ctx.wizard.next();
  }),

  // Step 1: Ask for name
  withTextMessage(async (ctx) => {
    ctx.scene.session.exampleWizard1.step1Answer = ctx.message.text;
    await ctx.reply('📍 <b>Step 2:</b> What do you do for a living?', {
      parse_mode: 'HTML',
    });
    return ctx.wizard.next();
  }),

  // Step 2: Ask for occupation
  withTextMessage(async (ctx) => {
    ctx.scene.session.exampleWizard1.step2Answer = ctx.message.text;
    await ctx.reply('📍 <b>Step 3:</b> What’s your favorite hobby?', {
      parse_mode: 'HTML',
    });
    return ctx.wizard.next();
  }),

  // Step 3: Ask for hobby
  withTextMessage(async (ctx) => {
    ctx.scene.session.exampleWizard1.step3Answer = ctx.message.text;
    await ctx.reply('📍 <b>Step 4:</b> Do you have any feedback or message for us?', {
      parse_mode: 'HTML',
    });
    return ctx.wizard.next();
  }),
);

// Command: /back — go back to previous step
exampleWizard.command('back', async (ctx) => {
  if (ctx.wizard.cursor > 0) {
    ctx.wizard.back();
  }

  setTimeout(async () => {
    const step = ctx.wizard.cursor;

    switch (step) {
      case 1:
        return await ctx.reply('📍 <b>Step 1:</b> What’s your name?', {
          parse_mode: 'HTML',
          reply_parameters: { message_id: ctx.msgId },
        });
      case 2:
        return await ctx.reply('📍 <b>Step 2:</b> What do you do for a living?', {
          parse_mode: 'HTML',
          reply_parameters: { message_id: ctx.msgId },
        });
      case 3:
        return await ctx.reply('📍 <b>Step 3:</b> What’s your favorite hobby?', {
          parse_mode: 'HTML',
          reply_parameters: { message_id: ctx.msgId },
        });
      default: {
        const { message_id } = await ctx.reply('⚠️ You are already at the beginning.', {
          reply_parameters: { message_id: ctx.msgId },
        });

        await sleep(2000);
        await ctx.deleteMessage(message_id);
        return await ctx.reply("Please reply with your answer: '✅ Yes' or '❌ No'.", {
          reply_markup: openingKeyboard.reply_markup,
          reply_parameters: { message_id: ctx.msgId },
        });
      }
    }
  }, 100);
});

// Command: /cancel — cancel the wizard
exampleWizard.command('cancel', async (ctx) => {
  ctx.scene.session.exampleWizard1 = {
    stepCanceled: true,
    stepCompleted: false,
  };

  await ctx.scene.leave();
  await ctx.reply('❌ Wizard canceled. You can restart anytime using /example4.', {
    reply_parameters: {
      message_id: ctx.msgId,
    },
  });
});

// Command: /help — show help
exampleWizard.command('help', async (ctx) => {
  await ctx.reply(
    `
❓ <b>Help — Wizard Example 1</b>

This wizard collects your input through a few short steps.
You can control the flow using these commands:

🔙 /back — Go back to the previous step  
❌ /cancel — Exit the wizard  
🚀 /example4 — Start over

Let me know if you're ready to continue!
`,
    { parse_mode: 'HTML' },
  );
});

// Triggered when the wizard starts
exampleWizard.enter(async (ctx) => {
  ctx.scene.session.exampleWizard1 = {
    stepCanceled: false,
    stepCompleted: false,
  };

  await ctx.reply(openingMessage, {
    parse_mode: 'HTML',
    ...openingKeyboard,
  });
});

// Triggered when the wizard ends
exampleWizard.leave(
  withTextMessage(async (ctx) => {
    ctx.scene.session.exampleWizard1.stepCompleted = true;
    ctx.scene.session.exampleWizard1.step4Answer = ctx.message.text;

    const {
      stepCanceled,
      stepCompleted,
      step0Answer,
      step1Answer,
      step2Answer,
      step3Answer,
      step4Answer,
    } = ctx.scene.session.exampleWizard1;

    if (!stepCanceled && stepCompleted) {
      const JSONData = htmlEncode(
        JSON.stringify(
          {
            step0Answer,
            step1Answer,
            step2Answer,
            step3Answer,
            step4Answer,
          },
          null,
          2,
        ),
      );

      const message =
        '<tg-spoiler>🎉 You’ve successfully completed Wizard Example 1!</tg-spoiler>\n\n' +
        'Here’s a summary of your responses:\n' +
        '<pre><code class="json">' +
        JSONData +
        '</code></pre>';

      await ctx.reply(message, { parse_mode: 'HTML' });
    }
  }),
);

// Register wizard scene into Stage
const wizardScene = new Scenes.Stage<MyContext>([exampleWizard]);

composer.use(wizardScene.middleware());

// Command: /example4 — start the wizard
composer.command('example4', async (ctx) => {
  await ctx.scene.enter('exampleWizard1');
});

export default composer;

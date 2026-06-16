# 🤖 Telegram Bot Starter Kit

A production-ready Telegram bot starter built with [Telegraf](https://telegraf.js.org/), TypeScript, Express, Redis sessions, and Winston logging. Comes with webhook support, custom command handling, reusable middleware filters, and daily-rotated log files out of the box.

[![CI](https://github.com/agoenks29D/telegram-bot/actions/workflows/ci.yml/badge.svg)](https://github.com/agoenks29D/telegram-bot/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-green)](https://nodejs.org)

## ✨ Features

- **TypeScript** — fully typed codebase with path aliases (`@/`)
- **Telegraf v4** — modern Telegram bot framework
- **Webhook & Polling** — switchable via environment variable
- **Redis Session** — persistent session store using `@telegraf/session`
- **Custom Command Handler** — supports both `/command` and `!command` prefixes with `@mention` filtering
- **Reusable Middleware Filters** — photo, voice, video, document, location, poll, contact, sticker, text, admin-only, chat-type
- **Winston Logging** — daily rotating log files for bot updates, errors, exceptions, and unhandled rejections
- **Express Server** — webhook endpoint served via `express`
- **SWC Compiler** — fast TypeScript compilation with `@swc/cli`
- **Unit Tests** — Jest + ts-jest with coverage reporting
- **Automated Dependency Updates** — Dependabot for npm and GitHub Actions

## 📁 Project Structure

```
src/
├── bot/
│   ├── config/        # Environment variable config
│   ├── helpers/       # Middleware filters & custom command handler
│   ├── utils/         # Bot logger & string utilities
│   └── index.ts       # Bot setup, middleware, command handlers
├── routes/
│   └── index.ts       # Express app with webhook callback
├── types/             # Shared TypeScript types & context extensions
├── utils/             # App-level logger & sleep utility
└── main.ts            # Entry point — HTTP server, bot launch, graceful shutdown
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** v20+
- **Redis** — running locally or via a remote URL
- **Telegram Bot Token** — get one from [@BotFather](https://t.me/BotFather)
- **ngrok** (optional) — for webhook development tunneling

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/agoenks29D/telegram-bot.git
cd telegram-bot

# 2. Install dependencies
npm install

# 3. Copy and fill in your environment variables
cp .env.example .env
```

### Environment Variables

| Variable             | Default              | Description                                    |
|----------------------|----------------------|------------------------------------------------|
| `TZ`                 | `UTC`                | Timezone for the application                   |
| `PORT`               | `3000`               | HTTP server port                               |
| `NODE_ENV`           | `production`         | `production` or `development`                  |
| `BOT_TOKEN`          | *(required)*         | Telegram Bot Token from BotFather              |
| `BOT_STORE`          | `redis`              | Session store type                             |
| `REDIS_URL`          | `redis://localhost:6379` | Redis connection URL                       |
| `BOT_WEBHOOK_ENABLE` | `false`              | Set to `true` to use webhook instead of polling |
| `BOT_WEBHOOK_PATH`   | `/`                  | URL path for the webhook endpoint              |
| `BOT_WEBHOOK_DOMAIN` | *(required if webhook)* | Public HTTPS domain (e.g. ngrok URL)       |

### Running the Bot

```bash
# Development (watch mode with hot reload)
npm run start:dev

# Production (build then start)
npm run build
npm start
```

---

## 🔗 Webhook Setup (Development)

To test webhooks locally, use [ngrok](https://ngrok.com/):

```bash
ngrok http 3000
```

Then update your `.env`:

```env
BOT_WEBHOOK_ENABLE = true
BOT_WEBHOOK_DOMAIN = https://your-ngrok-subdomain.ngrok-free.app
BOT_WEBHOOK_PATH = /
```

---

## 🧩 Usage

### Custom Commands

The `enableCustomCommands` helper extends `Composer` with an `onCommand` method that handles both `/command` and `!command` prefixes, including `@BotUsername` mention filtering.

```typescript
import { enableCustomCommands } from '@/bot/helpers';
import { Composer } from 'telegraf';

const composer = enableCustomCommands(new Composer<MyContext>());

composer.onCommand('hello', async (ctx) => {
  const [name] = ctx.payloads ?? [];
  await ctx.reply(`Hello, ${name ?? 'world'}!`);
});
```

### Middleware Filters

Import filters from `@/bot/helpers` to guard handlers by message type:

```typescript
import {
  withPhotoMessage,
  withTextMessage,
  withAdminOnly,
  withChatType,
} from '@/bot/helpers';

// Only runs if the message contains a photo
bot.on('message', withPhotoMessage(async (ctx) => {
  await ctx.reply('Got your photo!');
}));

// Restrict a command to group admins only
bot.command('ban', withAdminOnly(async (ctx) => {
  await ctx.reply('You are an admin!');
}));

// Run middleware only in private chats
bot.on('message', withChatType(['private'], async (ctx, next) => {
  // This runs only in DMs
  return next();
}));
```

### Session

Session data is persisted in Redis. Extend `MySession` in `src/types/telegraf.ts` to add your own fields:

```typescript
export interface MySession extends Scenes.WizardSession<MyWizardSession> {
  firstStart: boolean;
  myCustomField?: string; // add your fields here
}
```

Access it in handlers via `ctx.session.myCustomField`.

---

## 🧪 Testing

```bash
# Run all unit tests
npm test

# Run with coverage report
npm test -- --coverage
```

Tests are located in `__tests__/` directories alongside their source files.

---

## 📋 Available Scripts

| Script           | Description                                          |
|------------------|------------------------------------------------------|
| `npm run build`  | Compile TypeScript with SWC into `dist/`             |
| `npm start`      | Start the compiled bot from `dist/main.js`           |
| `npm run start:dev` | Watch mode: rebuild on change and restart bot     |
| `npm test`       | Run Jest unit tests                                  |
| `npm run format` | Format source files with Prettier                    |

---

## 📜 Logging

Logs are written to the `logs/` directory and rotated daily. Files are retained for **14 days** and compressed after rotation.

```
logs/
├── app/
│   ├── errors/       # App-level errors
│   ├── exceptions/   # Unhandled exceptions
│   └── rejections/   # Unhandled promise rejections
└── bot/
    ├── updates/      # All incoming Telegram updates
    ├── errors/       # Bot-level errors
    ├── exceptions/   # Unhandled exceptions
    └── rejections/   # Unhandled promise rejections
```

> The `logs/` directory is excluded from version control via `.gitignore`.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to your branch: `git push origin feat/your-feature-name`
5. Open a Pull Request

Please use [Conventional Commits](https://www.conventionalcommits.org/) for your commit messages.

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

---

## 👤 Author

**Agung Dirgantara** — [agungmasda29@gmail.com](mailto:agungmasda29@gmail.com)
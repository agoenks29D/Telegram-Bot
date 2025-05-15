# Telegram Bot Starter Kit

A minimal and fast TypeScript starter template for building **Telegram bots** using **Telegraf**. It utilizes **SWC** for ultra-fast TypeScript compilation and modern developer tooling to help you quickly develop and deploy Telegram bots.

## ✨ Features

- ⚡ Fast TypeScript compilation with SWC
- 📦 Built with **Telegraf** for Telegram bot framework
- 🧩 Path aliasing (`@/*`) for cleaner imports
- 🔁 Live reload in development with **nodemon**
- 🧹 Prettier, ESLint, and lint-staged for code quality
- 🔒 Git hooks via **Husky**
- 📝 Example bot commands and workflows
- 🚀 Easily extensible for more bot functionalities

## 🚀 Scripts

| Command             | Description                                 |
| ------------------- | ------------------------------------------- |
| `npm run build`     | Compile TypeScript using SWC                |
| `npm start`         | Run compiled JavaScript from `dist/main.js` |
| `npm run start:dev` | Watch and reload on changes (build + run)   |

## 📁 Project Structure

```text
├── dist/               # Folder containing the compiled JavaScript files
├── logs/               # Folder to store log files of the application
├── node_modules/       # Folder for installed Node.js dependencies
├── src/                # Folder for source code written in TypeScript
│   ├── bot/            # Contains all the bot-related code
│   │   ├── config/     # Configuration files for the bot (e.g., token, general settings)
│   │   ├── examples/   # Example bot scenes or flows (e.g., example-1.ts)
│   │   ├── helpers/    # Helper functions used by the bot
│   │   └── utils/      # Utility functions and other supporting tools
│   ├── routes/         # API routes (if the bot has any backend API integration)
│   ├── types/          # TypeScript types for application data (e.g., MyContext, Telegraf types)
│   └── utils/          # General utilities used across the application
├── .env.example        # Example environment variables file (e.g., bot token, API keys)
├── .gitignore          # List of files and directories to ignore in version control
├── README.md           # Project documentation
├── package-lock.json   # Lock file for dependencies to ensure consistent versions
├── package.json        # Metadata about the project and dependencies
└── tsconfig.json       # TypeScript configuration
```

## 🧑‍💻 Author

Created by [Agung Dirgantara](mailto:agungmasda29@gmail.com) — licensed under [MIT](LICENSE).

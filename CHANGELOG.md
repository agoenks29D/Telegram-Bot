# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog and this project adheres to Semantic Versioning.

## [v2.0.0](https://github.com/agoenks29D/Telegram-Bot/releases/tag/v2.0.0) - 2026-06-17

### Added

* Added Jest testing framework with TypeScript support.
* Added test coverage reporting configuration.
* Added GitHub Actions CI workflow for automated testing and validation.
* Added GitHub Issue Templates to improve issue reporting.

### Changed

* Refactored logger implementation to use a context-based factory instead of a singleton pattern.
* Updated TypeScript configuration for improved compatibility with TypeScript 6.
* Added Chokidar support for development file watching.
* Improved project README documentation.

### Documentation

* Added MIT License file.
* Improved repository documentation and project information.

### CI/CD

* Configured Dependabot to target the `develop` branch.
* Added automated GitHub Actions workflow.

### Maintenance

* Added format script for code formatting.
* Resolved npm audit vulnerabilities and updated dependencies.

---

## [v1.1.0](https://github.com/agoenks29D/Telegram-Bot/releases/tag/v1.1.0) - 2025-07-27

### Added

* Added reusable Telegram message type filters:

  * Photo messages
  * Voice messages
  * Video messages
  * Document messages
  * Location messages
  * Poll messages
  * Contact messages
* Added admin-only middleware support.
* Added `moment-timezone` dependency.

### Changed

* Refactored command handlers for improved maintainability.
* Moved global middleware initialization for better project structure.
* Renamed `commandArgs` to `payloads` in custom command handlers.
* Renamed helper module from `update` to `filters`.
* Replaced `ctx.message` with `ctx.msg` for consistency.
* Improved context typing and chat type middleware support.
* Removed unnecessary `try-catch` around `bot.launch`.

### Fixed

* Fixed dependency vulnerabilities using `npm audit fix`.

---

## [v1.0.0](https://github.com/agoenks29D/Telegram-Bot/releases/tag/v1.0.0) - 2025-05-17

### Added

* Initial Telegram bot framework release.
* TypeScript and SWC build setup.
* ESLint configuration.
* Husky pre-commit hooks.
* Example Telegram bot implementation.
* Chat type middleware support.
* Railway one-click deployment support.
* Branch overview documentation.
* Example project structure and entry point.

### Documentation

* Added project README with setup instructions and feature overview.

### Tooling

* Added EditorConfig, Prettier, Git Ignore, and TypeScript configuration files.
* Added SWC build configuration.
* Added ESLint integration.

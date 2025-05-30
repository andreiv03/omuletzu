# Omuletzu'

**Omuletzu** is a modern, type-safe **Discord bot template** built with **TypeScript**, **Discord.js v14**, and **SWC**. It provides a clean, fast, and scalable foundation for developing production-ready Discord applications.

## ✨ Features

- **Type-Safe Discord Bot** – Built with TypeScript for reliable development and better tooling.
- **Command & Event Autoloading** – Automatically loads commands and events from the filesystem.
- **Slash Command Support** – Uses Discord.js v14’s native slash commands.
- **Fast Build with SWC** – Ultra-fast transpilation for TypeScript via SWC.
- **Environment-Based Config** – Easy configuration using .env files and dotenv-flow.
- **Secure Token Handling** – Uses .env and avoids hardcoding secrets.
- **Modern Developer Tooling** – ESLint, Prettier, and security linting included by default.

## ⚡ Technology Stack

- **TypeScript** – Static typing and better dev experience.
- **Discord.js v14** – Complete support for modern Discord API features.
- **SWC** – Blazing-fast transpilation.
- **ESLint + Prettier** – Consistent, secure, and readable code.
- **dotenv-flow** – Environment variable management.
- **Node.js** – Lightweight and reliable runtime.

## ⚙️ Build & Installation

### Prerequisites

Before installing the project, ensure you have the following installed:

- **Node.js 18+** – Required for Discord.js v14.
- A Discord bot token – [Create a bot here](https://discord.com/developers/applications)

### Installation Instructions

Follow these steps to clone, build, and run Omuletzu':
```sh
# Clone the repository
git clone https://github.com/andreiv03/omuletzu.git
cd omuletzu

# Install dependencies
npm install

# Create a .env file in the root
echo "SECRET_TOKEN=your_bot_token" > .env

# Development (auto-restarts on changes)
npm run dev

# Production
npm run build
npm start

# Deploy slash commands
npm run deploy
```

## 🤝 Contributing

Contributions are welcome! If you'd like to enhance the project, follow these steps:

1. **Fork** the repository
2. Create a **feature branch** (`git checkout -b feature-branch`)
3. **Commit** your changes (`git commit -m "feat: add new feature"`)
4. **Push** your changes (`git push origin feature-branch`)
5. Open a **Pull Request** 🚀

For suggestions or bug reports, feel free to open an issue with the appropriate label.

⭐ **If you find this project useful, consider giving it a star!** ⭐

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for details.

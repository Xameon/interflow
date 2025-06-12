# 🌐 Interflow - Social network for communities based on interests and hobbies
A full-featured web platform where users can create communities based on interests or hobbies, publish posts, comment, subscribe to communities, and interact with others. The project is implemented as a fullstack web application using Next.js, PostgreSQL, Supabase, Firebase, and Chakra UI.

## 🚀 Features
- 👥 User authentication and profile management
- 🧑‍🤝‍🧑 Create communities with category selection and publication permissions
- 📝 Publish and browse posts within communities
- 💬 Comment on posts (supports nested comments)
- 🔍 Search for posts and communities
- 📸 Image uploads for posts (via Firebase Storage)
- 🧠 Data caching and invalidation with React Query
- 📱 Responsive and accessible UI built with Chakra UI

## 🛠️ Technologies
- Next.js 15 (App Router)
- Chakra UI 3
- Tanstack Query
- PostgreSQL
- TypeScript
- ESLint & Prettier
 
## 💻 Required Software
| 🛠️ Tool     | 🔗 Download Links                                                                                                                                                             | 💬 Notes                              |
| :---------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------ |
| **Node.js** | [Windows / macOS / Linux](https://nodejs.org/)                                                                                                                                | Version `20` or higher is required.   |
| **npm**     | [Included with Node.js](https://nodejs.org/)                                                                                                                                  | Installed automatically with Node.js. |
| **VS Code** | [Windows](https://code.visualstudio.com/docs/setup/windows) / [macOS](https://code.visualstudio.com/docs/setup/mac) / [Linux](https://code.visualstudio.com/docs/setup/linux) | Recommended editor.                   |
| **Git**     | [Windows](https://git-scm.com/download/win) / [macOS](https://git-scm.com/download/mac) / [Linux](https://git-scm.com/download/linux)                                         | Version control system.               |
| **Browser** | [Google Chrome](https://www.google.com/chrome/) / [Firefox](https://www.mozilla.org/firefox/new/) / Any modern browser                                                        | Used for testing and running the app. |

## 👍 Recommended VS Code Extensions
| 🧩 Extension                                                                                                        | 📝 Description                                                                                       |
| :------------------------------------------------------------------------------------------------------------------ | :--------------------------------------------------------------------------------------------------- |
| [**Better Comments**](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments)               | Improve code readability by categorizing comments into alerts, queries, TODOs, highlights, and more. |
| [**Code Spell Checker**](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) | A basic spell checker to catch common spelling mistakes in code, comments, strings, and more.        |
| [**ESLint**](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)                            | Integrates ESLint into VS Code to automatically find and fix problems in JavaScript/TypeScript code. |
| [**Prettier - Code Formatter**](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)         | An opinionated code formatter that enforces a consistent style by parsing and reprinting your code.  |

_These extensions help maintain clean and high-quality code._

## ⚡ Getting Started
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the project:
   ```bash
   npm run dev
   ```
   
## ❗ Before Pushing
1. Format the code:
   ```bash
   npm run prettier
   ```
2. Lint the code:
   ```bash
   npm run lint
   ```
3. Check type errors:
   ```
   npm run tsc
   ```

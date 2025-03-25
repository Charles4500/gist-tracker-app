# Gist Tracker - GitHub Gists Management Application

## Overview

**Gist Tracker** is a modern web application that helps users manage and explore GitHub Gists with an intuitive interface. Built with **Next.js**, **TypeScript**, and **Tailwind CSS**, this application provides a seamless experience for viewing, creating, editing, and organizing your code snippets.

## Features

### 🚀 Core Functionality

- **Browse Public Gists**: Discover trending and popular code snippets.
- **Personal Gist Management**: View, create, edit, and delete your own gists.
- **Detailed Gist Viewing**: See complete gist contents with syntax highlighting.
- **Search Functionality**: Quickly find gists by content, language, or description.

### ✨ User Experience

- **Responsive Design**: Works perfectly on desktop and mobile devices.
- **Loading States**: Smooth transitions between views.
- **Error Handling**: Clear feedback when things go wrong.

---

## 🔒 Authentication

- **GitHub OAuth Integration**: Securely log in with your GitHub account.
- **Secure Session Management**: Keep your data safe.
- **Personalized Dashboard**: Access your gists and preferences.

---

## Technologies Used

### Frontend

- **Next.js 14**: React framework for server-rendered applications.
- **TypeScript**: Type-safe JavaScript.
- **Tailwind CSS**: Utility-first CSS framework.
- **shadcn/ui**: Beautifully designed components.
- **NextAuth.js**: Authentication solution.

### Backend

- **GitHub REST API**: For all gist operations.
- **Vercel Edge Functions**: API routes and middleware.

### Database

- **Mongoose**: MongoDB object modeling tool.

### Development Tools

- **ESLint**: JavaScript/TypeScript linter.
- **Prettier**: Code formatter.
- **Commitlint**: Enforce conventional commits.

---

## Getting Started

### Prerequisites

- **Node.js v18+**
- **GitHub account**
- **GitHub OAuth App credentials**

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Charles4500/gist-tracker-app
   cd gist-tracker-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   . Create a `.env` file in the root directory.
   . Add the following environment variables:
   ```env
   GITHUB_CLIENT_ID=your_client_id
   GITHUB_CLIENT_SECRET=your_client_secret
   NEXT_PUBLIC_GITHUB_TOKEN=your_personal_access_token
   NEXTAUTH_URL=http://localhost:3000
   MONGODB_URI=mondodbconnectionstring
   ```
4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

# Project Workflow Guide

This file outlines environment-specific commands and critical sequences that an agent should follow, as direct guesses can lead to incorrect builds or missing type checks.

## Installation & Setup
- **Initial Setup:** Run `npm install` to install all dependencies.

## Development Workflow
- **Development Server:** Use `npm run dev` to start the development server using `electron-vite`.
- **Linting:** Run `npm run lint` to check for ESLint errors.
- **Typechecking (CRITICAL):** Type checking must be done in two stages because the project uses separate TypeScript configurations for Node and Web environments.
  - Run: `npm run typecheck` (Note: This script sequences `typecheck:node` and `typecheck:web`).

## Building and Deployment
The build process uses `electron-builder` and requires specific commands depending on the target OS.

1.  **Generic Build Steps:**
    - The base build step (`npm run build`) first runs the full typecheck (`npm run typecheck`) and then executes the general `electron-vite build` command.

2.  **Platform-Specific Builds:**
    - **Windows:** Use `npm run build:win` to build and package for Windows.
    - **macOS:** Use `npm run build:mac` to build and package for macOS.
    - **Linux:** Use `npm run build:linux` to build and package for Linux.
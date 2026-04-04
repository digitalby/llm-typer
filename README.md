# LLM Typer

[![CI](https://github.com/digitalby/llm-typer/actions/workflows/ci.yml/badge.svg)](https://github.com/digitalby/llm-typer/actions/workflows/ci.yml)

**Live:** https://llm-typer.vercel.app

A two-column web app that streams any text to screen ChatGPT-style — letter by letter or word by word — with configurable speed, jitter, and colors.

## Features

- **Letter or word mode** — type one character or one word per tick
- **Speed control** — 10 ms to 500 ms per token via slider
- **Jitter** — randomized ±% variation per tick so the output feels alive rather than mechanical
- **Color picker** — choose any foreground and background color for the output pane
- **Auto-scroll** — output pane scrolls to follow the cursor as text grows
- **Blinking cursor** — animated block cursor during playback, disappears when done

## Stack

- [Next.js 16](https://nextjs.org) (App Router)
- [React 19](https://react.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com) (Base UI primitives)
- [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com)
- Deployed on [Vercel](https://vercel.com)

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run test` | Vitest in watch mode |
| `npm run test:ci` | Vitest single run (used in CI) |

## CI

GitHub Actions runs lint, tests, and build on every push and pull request. See [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

## Project structure

```
app/
  layout.tsx          Root layout with font and metadata
  page.tsx            Entry point — renders TyperLayout
  globals.css         Tailwind base + blinking cursor animation
components/
  typer-layout.tsx    Client root: all shared state + two-column flex layout
  settings-panel.tsx  Left pane: text input, mode, speed, jitter, colors, buttons
  output-panel.tsx    Right pane: typed output with blinking cursor
  ui/                 shadcn/ui components
hooks/
  use-typer.ts        Core typing animation hook (letter/word, jitter, start/stop/reset)
__tests__/
  use-typer.test.ts   Unit tests for the hook (9 tests)
```

## How jitter works

Each tick schedules the next token after `speed + rand(-jitter*speed, +jitter*speed)` milliseconds, clamped to a minimum of 1 ms. At 50% jitter and 100 ms speed, each character fires somewhere between 50 ms and 150 ms after the previous one.

## Wishlist / roadmap

See the [open issues](../../issues) for planned features.

## License

MIT

# AI Interview Assistant Landing Page

A modern landing page for an AI-powered interview preparation platform built with Next.js 16, React 19, and Tailwind CSS.

## Features

- **Hero Section**: Eye-catching introduction with clear call-to-action
- **Features Showcase**: Highlights key platform capabilities including AI mock interviews, real-time feedback, and personalized improvement tracking
- **Pricing Section**: Simple, transparent pricing display ($5/month Pro Plan)
- **CTA Section**: Conversion-focused call-to-action
- **Footer**: Essential links and copyright information
- **Dark Mode Support**: Full dark mode implementation across all components
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 16.1.6 with App Router
- **React**: 19.2.3
- **Styling**: Tailwind CSS 4
- **UI Components**: Mantine Core 8.3.14
- **State Management**: TanStack React Query 5.90.21
- **TypeScript**: Full type safety
- **Package Manager**: Bun

## Getting Started

Install dependencies:

```bash
bun install
```

Run the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the landing page.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx       # Root layout with providers
│   ├── page.tsx         # Main landing page
│   ├── providers.tsx    # React Query and Mantine providers
│   └── globals.css      # Global styles
└── components/
    ├── Hero.tsx         # Hero section
    ├── Features.tsx     # Features showcase
    ├── Pricing.tsx      # Pricing section
    ├── CTA.tsx          # Call-to-action section
    └── Footer.tsx       # Footer component
```

## Available Scripts

- `bun dev` - Start development server
- `bun build` - Build for production
- `bun start` - Start production server
- `bun lint` - Run ESLint

## Deployment

Deploy easily on [Vercel](https://vercel.com/new) or any platform that supports Next.js applications.

For detailed deployment instructions, see the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

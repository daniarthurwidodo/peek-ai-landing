# AI Interview Assistant

A full-stack SaaS platform for AI-powered interview preparation built with Next.js 16, React 19, and modern web technologies.

## Features

### Landing Page
- **Hero Section**: Eye-catching introduction with clear call-to-action
- **Features Showcase**: Highlights key platform capabilities including AI mock interviews, real-time feedback, and personalized improvement tracking
- **Pricing Section**: Simple, transparent pricing display ($5/month Pro Plan)
- **CTA Section**: Conversion-focused call-to-action
- **Footer**: Essential links and copyright information
- **Dark Mode Support**: Full dark mode implementation across all components
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Authentication & Authorization
- **Clerk Integration**: Secure user authentication and management
- **Protected Routes**: Middleware-based route protection for dashboard
- **Auto-redirect**: Authenticated users automatically redirected to dashboard
- **Webhook Support**: User sync via Clerk webhooks

### Payment Integration
- **Paddle Integration**: Subscription management and payment processing
- **Client Token API**: Secure token generation for Paddle checkout
- **Sandbox Environment**: Testing-ready payment setup

### Database
- **PostgreSQL**: Robust relational database
- **Drizzle ORM**: Type-safe database queries and migrations
- **Docker Support**: Containerized database setup via docker-compose

### Dashboard
- **Protected Area**: Authenticated user dashboard
- **User Management**: Logout functionality and user controls

## Tech Stack

- **Framework**: Next.js 16.1.6 with App Router
- **React**: 19.2.3 with React Compiler
- **Styling**: Tailwind CSS 4
- **UI Components**: Mantine Core 8.3.14
- **State Management**: TanStack React Query 5.90.21
- **Authentication**: Clerk
- **Payments**: Paddle
- **Database**: PostgreSQL with Drizzle ORM
- **Logging**: Pino with pretty printing
- **TypeScript**: Full type safety
- **Package Manager**: Bun

## Getting Started

### Prerequisites

- Bun installed
- Docker and Docker Compose (for database)
- Clerk account for authentication
- Paddle account for payments

### Environment Setup

1. Copy `.env` file and configure your environment variables:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/myapp
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=myapp

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret

# Paddle Payments
PADDLE_API_KEY=your_paddle_api_key
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=your_paddle_client_token
NEXT_PUBLIC_PADDLE_ENVIRONMENT=sandbox
NEXT_PUBLIC_PADDLE_PRICE_ID=your_paddle_price_id
```

### Installation

1. Install dependencies:

```bash
bun install
```

2. Start the PostgreSQL database:

```bash
docker-compose up -d
```

3. Run database migrations:

```bash
bun run db:push
```

4. Start the development server:

```bash
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── paddle/
│   │   │   └── client-token/    # Paddle token generation
│   │   └── webhooks/
│   │       └── clerk/           # Clerk user sync webhook
│   ├── dashboard/
│   │   ├── page.tsx             # Protected dashboard page
│   │   └── LogoutButton.tsx     # User logout component
│   ├── lib/
│   │   └── db/
│   │       ├── index.ts         # Database connection
│   │       └── schema.ts        # Drizzle schema definitions
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Landing page
│   ├── providers.tsx            # React Query and Mantine providers
│   └── globals.css              # Global styles
├── components/
│   ├── Hero.tsx                 # Hero section
│   ├── Features.tsx             # Features showcase
│   ├── Pricing.tsx              # Pricing section with Paddle
│   ├── CTA.tsx                  # Call-to-action section
│   └── Footer.tsx               # Footer component
├── lib/
│   └── logger.ts                # Pino logger configuration
└── middleware.ts                # Clerk auth middleware
```

## Available Scripts

- `bun dev` - Start development server
- `bun build` - Build for production
- `bun start` - Start production server
- `bun lint` - Run ESLint
- `bun run db:generate` - Generate Drizzle migrations
- `bun run db:migrate` - Run database migrations
- `bun run db:push` - Push schema changes to database
- `bun run db:studio` - Open Drizzle Studio for database management

## API Routes

### Paddle Integration
- `POST /api/paddle/client-token` - Generate Paddle client token for checkout

### Webhooks
- `POST /api/webhooks/clerk` - Clerk user synchronization webhook

## Deployment

### Environment Variables

Ensure all environment variables are configured in your deployment platform:
- Database connection string
- Clerk authentication keys and webhook secret
- Paddle API credentials and configuration

### Vercel Deployment

Deploy easily on [Vercel](https://vercel.com/new):

1. Connect your repository
2. Configure environment variables
3. Deploy

For detailed deployment instructions, see the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

### Database Setup

Ensure your PostgreSQL database is accessible from your deployment environment. Run migrations after deployment:

```bash
bun run db:push
```

## Development Notes

- The application uses React 19 with the React Compiler for optimized performance
- Middleware handles authentication and auto-redirects
- Paddle is configured for sandbox environment by default
- Clerk webhooks require proper webhook secret configuration
- Database schema is managed through Drizzle ORM

## Documentation

Comprehensive documentation is available in the `/docs` directory:

- **[Constitution](./docs/CONSTITUTION.md)** - Development principles and standards
- **[Architecture](./docs/ARCHITECTURE.md)** - Multi-tier architecture design
- **[Specs Workflow](./docs/SPECS_WORKFLOW.md)** - Feature specification process
- **[Design System](./docs/DESIGN_SYSTEM.md)** - UI/UX guidelines and components
- **[Product Requirements](./PRD.md)** - Product roadmap and requirements

### Specifications

Feature and technical specifications are in the `/specs` directory:

- **[Feature Specs](./specs/features/)** - User-facing feature specifications
- **[Technical Specs](./specs/technical/)** - Architecture and implementation specs
- **[Templates](./specs/templates/)** - Spec templates for new features

## Architecture

The application follows a modular multi-tier architecture:

- **Presentation Layer** - UI components and user interactions (`src/app`, `src/components`)
- **Business Logic Layer** - Domain logic and validation (`src/services`, `src/use-cases`)
- **Data Access Layer** - Database and API operations (`src/repositories`, `src/clients`)
- **Infrastructure Layer** - Cross-cutting concerns (`src/lib`)

See [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for detailed information.

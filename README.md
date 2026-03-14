# TripGo API

Backend API and real-time WebSocket server for TripGo.

## Tech Stack

- **Node.js** – Runtime
- **Fastify** – HTTP framework
- **Socket.IO** – Real-time WebSockets
- **TypeScript** – Type safety
- **PostgreSQL + PostGIS** – Database with geospatial support
- **Redis** – Caching and Socket.IO adapter
- **Supabase** – Auth and optional services

## Prerequisites

- Node.js 20+
- Docker (for local Postgres + Redis)

## Getting Started

```bash
# Clone the repository
git clone <repo-url>
cd tripgo-api

# Install dependencies
npm install

# Copy environment template and configure
cp .env.example .env

# Start Postgres and Redis (from tripgo-infra or local Docker)
docker compose up -d

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
```

The API will be available at `http://localhost:4000`.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with hot reload (tsx watch) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run start` | Run production build |
| `npm run lint` | Lint with ESLint |
| `npm run type-check` | TypeScript type checking |
| `npm run test` | Run tests with Vitest |
| `npm run db:migrate` | Run database migrations |

## API Documentation

When the server is running, Swagger UI is available at:

**http://localhost:4000/documentation**

## Project Structure

```
src/
├── modules/       # Feature modules
│   ├── trip/      # Trips
│   ├── place/     # Places
│   ├── day/       # Day planning
│   ├── activity/  # Activities
│   ├── member/    # Trip members
│   ├── chat/      # Chat (routes + gateway)
│   ├── location/  # Live location (gateway)
│   ├── bill/      # Bills/expenses
│   ├── route/     # Routing (OSRM)
│   ├── notification/  # Push notifications
│   └── invite/    # Invitations
├── plugins/       # Fastify plugins (cors, auth, socket)
├── lib/           # Shared libs (redis, osrm, r2)
├── db/            # Database client and migrations
└── server.ts      # Entry point
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 4000) |
| `CORS_ORIGIN` | Allowed CORS origin |
| `DATABASE_URL` | PostgreSQL connection string |
| `SUPABASE_SERVICE_KEY` | Supabase service role key |
| `SUPABASE_URL` | Supabase project URL |
| `REDIS_URL` | Redis connection string |
| `R2_ENDPOINT` | Cloudflare R2 endpoint |
| `R2_ACCESS_KEY` | R2 access key |
| `R2_SECRET_KEY` | R2 secret key |
| `R2_BUCKET` | R2 bucket name |
| `OSRM_URL` | OSRM server URL (e.g. `http://localhost:5000`) |
| `VAPID_PUBLIC_KEY` | Web Push VAPID public key |
| `VAPID_PRIVATE_KEY` | Web Push VAPID private key |

## Docker

Build and run with Docker:

```bash
docker build -t tripgo-api .
docker run -p 4000:4000 --env-file .env tripgo-api
```

## Deployment

Auto-deploys to **Railway** on push to `main`. Configure environment variables in the Railway dashboard.

## Related Repositories

- [tripgo-web](../tripgo-web) – Frontend PWA
- [tripgo-infra](../tripgo-infra) – Database migrations, Docker configs
- [tripgo-osrm](../tripgo-osrm) – OSRM routing engine for Vietnam

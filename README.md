# FindEnElev (FEE)

Next.js-platform med PostgreSQL: offentlig oversigt over **partnere** (virksomheder), og efter login med **Mercantec Auth** mulighed for at se og administrere **elever** (søgende eller placeret hos partner).

## Krav

- Node.js 22+ (lokal udvikling)
- Docker med Compose (valgfrit hele stacken)
- En OAuth-klient hos [Mercantec Auth](https://auth.mercantec.tech/.well-known/mercantec-auth.json)

## Mercantec Auth

1. Registrér en klient med **redirect URI** der matcher præcist (inkl. trailing slash hvis I bruger den):
   - Lokal: `http://localhost:3000/api/auth/callback/mercantec`
   - Produktion: `https://<jeres-domæne>/api/auth/callback/mercantec`
2. Brug **PKCE** (påkrævet for mange offentlige klienter). Uden `client_secret` sættes automatisk `token_endpoint_auth_method: none` i appen.
3. Efter log ud ryddes Mercantec-session via `GET https://auth.mercantec.tech/signout?returnUrl=...` (allerede koblet på **Log ud**).

## Miljøvariabler

Kopier [`.env.example`](.env.example) til `.env` og udfyld:

| Variabel | Beskrivelse |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL-forbindelse |
| `AUTH_SECRET` | Hemmelighed til Auth.js (fx `openssl rand -base64 32`) |
| `AUTH_URL` | Appens offentlige base-URL (fx `http://localhost:3000`) |
| `MERCANTEC_CLIENT_ID` | Client id fra Mercantec |
| `MERCANTEC_CLIENT_SECRET` | Valgfri, kun for fortrolig klient |

## Kørsel med Docker Compose

```bash
# Opret .env med mindst AUTH_SECRET og MERCANTEC_CLIENT_ID
docker compose up --build
```

App: [http://localhost:3000](http://localhost:3000). Postgres eksponeres på port **5432** (bruger/adgangskode/database: `fee` / `fee` / `fee` som i Compose-filen).

Ved `docker compose up` kører servicen **migrate** først (`prisma migrate deploy` med fuldt build-image); når den er færdig, starter **app** (Next.js standalone).

## Lokal udvikling (uden app i Docker)

1. Start kun databasen: `docker compose up -d db`
2. `.env` med `DATABASE_URL=postgresql://fee:fee@localhost:5432/fee` og øvrige variabler
3. `npm install`
4. `npx prisma migrate deploy` (eller `npm run db:migrate` under udvikling)
5. `npm run dev`

Valgfri demo-data: `npm run db:seed`

## Scripts

- `npm run dev` — udviklingsserver (Turbopack)
- `npm run build` / `npm start` — produktion
- `npm run db:migrate` — Prisma migrate dev
- `npm run db:deploy` — migrate deploy (fx CI/prod)
- `npm run db:seed` — seed

## Struktur

- [`src/app/(public)/page.tsx`](src/app/(public)/page.tsx) — offentlig partnerliste
- [`src/app/(protected)/elever/`](src/app/(protected)/elever/) — elever (kræver login)
- [`src/app/(protected)/partnere/`](src/app/(protected)/partnere/) — CRUD partnere (kræver login)
- [`src/auth.ts`](src/auth.ts) — Auth.js + Mercantec OAuth (PKCE, profil fra access token JWT)

## Roller og sikkerhed

Alle **indloggede** brugere kan oprette/rette/slette data (som aftalt). I kan senere begrænse dette via `role`-claims i Mercantec-JWT i server actions.

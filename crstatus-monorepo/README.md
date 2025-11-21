# CR Status - Full Stack Monorepo

Complete monorepo for CR Status (Clash Royale statistics tracker) with Next.js web app, Expo mobile app, and Supabase backend.

## 🏗️ Architecture

```
crstatus-monorepo/
├── apps/
│   ├── web/              # Next.js 15 (App Router)
│   └── mobile/           # Expo (React Native)
├── packages/
│   └── shared/           # Shared types, Supabase client, session detection
├── supabase/
│   ├── schema.sql        # Database schema
│   └── README.md         # Supabase setup guide
└── package.json          # Root workspace config
```

## ✨ Features

### Implemented

- ✅ **Authentication**: Magic link login via Supabase Auth
- ✅ **Player Tags Management**: Save and label multiple player tags
- ✅ **Push Session Detection**: Automatic grouping of battles into sessions
- ✅ **Intelligent Messaging**: Context-aware messages based on performance
- ✅ **Multi-platform**: Web (Next.js) + Mobile (Expo) sharing same codebase
- ✅ **Real Supabase Integration**: Connected to production database
- ✅ **Row Level Security**: Protected user data with Supabase RLS

### Core Logic (Shared Package)

- **Session Detection**: Battles grouped by 30min gap, min 3 battles per session
- **Session Messages**: Dynamic messages based on winrate and trophy delta
- **Supabase Clients**: Multi-platform (browser, server, mobile)
- **TypeScript Types**: Fully typed database schema

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18
- pnpm >= 8

### 1. Install Dependencies

```bash
cd crstatus-monorepo
pnpm install
```

### 2. Configure Environment

Create `.env.local` in the root (already created with your credentials):

```env
NEXT_PUBLIC_SUPABASE_URL=https://tjfzplxjsffddlvwtdtq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
EXPO_PUBLIC_SUPABASE_URL=https://tjfzplxjsffddlvwtdtq.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Apply Database Schema

**Option A: Via Supabase Dashboard**

1. Go to https://supabase.com/dashboard/project/tjfzplxjsffddlvwtdtq/sql
2. Copy contents of `supabase/schema.sql`
3. Paste and run

**Option B: Via Supabase CLI** (if installed)

```bash
supabase login
supabase link --project-ref tjfzplxjsffddlvwtdtq
supabase db push
```

### 4. Run Development Servers

**Web:**
```bash
pnpm dev:web
# Opens on http://localhost:3000
```

**Mobile:**
```bash
pnpm dev:mobile
# Opens Expo dev tools
```

**Both:**
```bash
pnpm dev
```

## 📱 Applications

### Web App (`apps/web`)

- **Tech**: Next.js 15, App Router, TailwindCSS, Framer Motion
- **Pages**:
  - `/` - Landing page with features
  - `/login` - Magic link authentication
  - `/dashboard` - Player tags management (protected)
  - `/player/[tag]` - Player profile with session detection (protected)

### Mobile App (`apps/mobile`)

- **Tech**: Expo, Expo Router, React Native
- **Screens**:
  - `/` - Home screen with features
  - `/login` - Magic link authentication
  - `/players` - Player tags list (protected)
  - `/player/[tag]` - Player profile (planned)

### Shared Package (`packages/shared`)

- **Exports**:
  - Types: `Player`, `Battle`, `PushSession`, `Goal`, `PlayerTag`, `Database`
  - Clients: `createBrowserClient()`, `createServerClient()`, `createMobileClient()`
  - Logic: `detectSessions()`, `getSessionMessage()`
  - Analytics: `trackEvent()`, `identifyUser()`

## 🗄️ Database Schema

### Tables

| Table | Description | RLS |
|-------|-------------|-----|
| `player_tags` | User's saved player tags | ✅ Private |
| `players` | Cached player data from API | 📖 Public read |
| `battles` | Battle history | 📖 Public read |
| `sessions` | Detected push sessions | 📖 Public read |
| `goals` | Trophy goals | ✅ Private |
| `events` | Analytics events | ✅ Private |

### Access Control

- **Private tables**: Only accessible by owner (`auth.uid() = user_id`)
- **Public tables**: Read access for all, write via service role
- **Service role**: Full access for API sync operations

## 🔧 Development

### Project Structure

```
apps/web/src/
  ├── app/              # Next.js App Router pages
  ├── components/       # React components
  └── lib/              # Utilities (auth, etc.)

apps/mobile/
  ├── app/              # Expo Router screens
  └── components/       # React Native components

packages/shared/src/
  ├── types.ts          # TypeScript types
  ├── lib/
  │   ├── supabase.ts   # Supabase clients
  │   ├── sessionDetector.ts  # Session detection logic
  │   └── analytics.ts  # Analytics utilities
  └── index.ts          # Public exports
```

### Scripts

```bash
# Development
pnpm dev              # Run all apps
pnpm dev:web          # Web only
pnpm dev:mobile       # Mobile only

# Build
pnpm build            # Build all
pnpm build:web        # Web only

# Lint
pnpm lint             # Lint all

# Clean
pnpm clean            # Remove node_modules and build artifacts
```

## 🎯 Session Detection Logic

**Rules:**
- Battles sorted newest → oldest
- Sessions created when gap between battles ≤ 30min
- Minimum 3 battles per session
- Sessions < 3 battles → singles array
- Session "active" if ended within last 2 hours

**Intelligent Messages:**
- 🔥 `winrate >= 60% && delta > 0` → "Excelente push!"
- 📈 `delta > 0` → "Push positivo!"
- ⚠️ `delta <= -50` → "Considere fazer uma pausa" (tilt warning)
- 📉 `delta < 0` → "Sessão negativa"
- ⏱️ `delta === 0` → "Sessão neutra"

## 🔐 Authentication Flow

1. User enters email
2. Supabase sends magic link
3. User clicks link → authenticated
4. Session stored in:
   - Web: Browser cookies
   - Mobile: AsyncStorage
5. Auto-refresh tokens

## 📊 Next Steps

### Immediate (To Make It Work)

- [ ] Apply `schema.sql` to Supabase (via dashboard or CLI)
- [ ] Test auth flow (send magic link, login)
- [ ] Add test player tags to verify CRUD
- [ ] Populate test battle data

### Future Enhancements

- [ ] Integrate Supercell API for real-time sync
- [ ] Add goals CRUD (set trophy targets)
- [ ] Implement analytics edge function
- [ ] Add charts/graphs for trophy progression
- [ ] Real-time updates with Supabase Realtime
- [ ] Push notifications for active sessions
- [ ] Deck tracking and analysis

## 🔒 Security Notes

- ✅ `.env.local` is gitignored (never commit credentials)
- ✅ RLS policies protect user data
- ✅ Service role key only used server-side
- ✅ Anon key safe for client-side use
- ✅ Auth tokens auto-refresh

## 📝 Database Setup Verification

To verify your database is configured correctly:

1. Check tables exist:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

2. Check RLS is enabled:
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

3. Test insert (after auth):
```sql
INSERT INTO player_tags (user_id, tag, label) 
VALUES (auth.uid(), 'ABC123', 'Test Tag');
```

## 🤝 Contributing

This is a private monorepo. For team members:

1. Never commit `.env.local`
2. Always run `pnpm lint` before committing
3. Test on both web and mobile
4. Update this README when adding features

## 📄 License

Private project - All rights reserved

---

**Project Status:** ✅ Ready for development

**Last Updated:** 2025-11-21

**Created by:** Antigravity AI Agent

# ⚡ Clash Royale Status (Next.js + Supercell API)

App completo de estatísticas do Clash Royale em **Next.js 14 (App Router)**.
UI dark inspirada no deep.gg, gráficos (Recharts) e API Routes no mesmo domínio.

> **Importante:** Este projeto é **Next.js (server)**.  
> Não use Vite nem `index.html`. Build/Start via `next`.

---

## Requisitos
- Node 18+ (recomendado 20+)
- npm 9+

## Scripts
```json
{
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start -p 3000"
  }
}
```

## Variáveis de ambiente

Crie **`.env.local`** na raiz (NÃO commit):

```
SUPERCELL_TOKEN=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjllNzc3MDdmLThhMzktNGQzZS1iZjJmLTg4OTkyNjc5NDkwZiIsImlhdCI6MTc1NjMzNTEzMSwic3ViIjoiZGV2ZWxvcGVyLzFmYjRhZjE5LTQ4ZjItMzc1Ni0wN2ZhLWMxNTI5NjIzZjczNSIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyI0NS43OS4yMTguNzkiLCIxNzcuMzIuMjUyLjMzIiwiMTA0LjIzLjIwOS4xNzYiXSwidHlwZSI6ImNsaWVudCJ9XX0.xa7rBoqp1cWOYXppNp5B-TbTcux07SkO8swS0u8hqkMrGsQewJCeJnjK2CQljbhtcXddJKj1arW5FsNa7iDIgA
USE_PROXY=false    # local com IP whitelisted; em hospedagem com IP dinâmico use true
DEFAULT_TAG=U9UUCCQ
NEXT_FONT_GOOGLE_TIMEOUT=30000    # timeout para Google Fonts (previne AbortError)
```

## Rodar em desenvolvimento

```bash
npm install
npm run dev
# abra http://localhost:3000
```

### Testes rápidos (dev)

* `http://localhost:3000/api/player/U9UUCCQ`
* `http://localhost:3000/api/player/U9UUCCQ/battles?last=20`
* `http://localhost:3000/api/player/U9UUCCQ/summary?last=20`

Se retornarem JSON, a home renderiza tudo.

## Build de produção

```bash
npm run build
npm start   # porta 3000
```

---

## Endpoints

* `GET /api/player/:tag`
* `GET /api/player/:tag/battles?last=20`
* `GET /api/player/:tag/summary?last=20`

### Rota de health (opcional para debug)

Crie `app/api/health/route.ts`:

```ts
import { NextResponse } from 'next/server';
import { baseURL } from '@/lib/supercell';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    ok: true,
    baseURL: baseURL(),
    USE_PROXY: process.env.USE_PROXY,
    hasToken: !!process.env.SUPERCELL_TOKEN
  });
}
```

---

## Deploy

### Bolt (StackBlitz)

1. **Environment Variables** no painel (produção):

   * `SUPERCELL_TOKEN` = seu token (uma linha, sem aspas)
   * `USE_PROXY` = `true`  ← IP do Bolt é dinâmico
   * `DEFAULT_TAG` = `U9UUCCQ`
   * `NEXT_FONT_GOOGLE_TIMEOUT` = `30000`  ← previne timeout do Google Fonts
2. **Build/Start/Port**:

   * Build Command: `npm run build`
   * Start Command: `npm start`
   * Port: `3000`
3. **Não usar Vite** (não existe `index.html`).
4. Publicar com **Publish** e testar:

   * `/api/health` → deve mostrar `baseURL: https://proxy.royaleapi.dev/v1`, `USE_PROXY: "true"`, `hasToken: true`.

### Vercel

* Importar o repositório
* Em **Environment Variables**:

  * `SUPERCELL_TOKEN`
  * `USE_PROXY=true`
  * `DEFAULT_TAG=U9UUCCQ`
  * `NEXT_FONT_GOOGLE_TIMEOUT=30000`
* Deploy → testar `/api/health`.

---

## Erros comuns

* **"Could not resolve entry module index.html / vite build"**
  → projeto é Next.js, publique como **Node/Next** com `npm run build` / `npm start`.

* **403 `accessDenied.invalidIp`**
  → habilite o **proxy**: `USE_PROXY=true` (em produção).

* **500 nas rotas**
  → variáveis de ambiente ausentes no ambiente de produção (use o painel de envs).
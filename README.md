# ⚡ Clash Royale Status (Next.js + Supercell API)

App completo de estatísticas do Clash Royale usando **Next.js 14 (App Router)** e a **API oficial da Supercell**.
Interface inspirada no deep.gg com tema dark e gráficos interativos.

**✅ Corrigido para evitar erro `t._onTimeout` no Bolt**

## ⚙️ Configuração

* **Framework**: Next.js 14 (App Router)
* **Porta**: 3000
* **Styling**: Tailwind CSS
* **Gráficos**: Recharts
* **API**: Supercell Official API

## 🔐 Variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
SUPERCELL_TOKEN=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImVhMmU0NWEwLTVlMzEtNGZjZS04MDkyLTMzZjYxNjQ1YWNjYyIsImlhdCI6MTc1NjI5OTk2NCwic3ViIjoiZGV2ZWxvcGVyLzFmYjRhZjE5LTQ4ZjItMzc1Ni0wN2ZhLWMxNTI5NjIzZjczNSIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyIxNzcuMzIuMjUyLjMzIl0sInR5cGUiOiJjbGllbnQifV19.QE4jGzMK-ECR9EE64aYWTRK7famC7MYDX-UssJWueXUVIWrX-FOIqcDgvDuTlvWQkMiSE6DbD17_uyk-C9TAKg
USE_PROXY=true
DEFAULT_TAG=U9UUCCQ
```

> ⚠️ **Importante**: Use `USE_PROXY=true` no Bolt (IP dinâmico).

## 🚀 Como rodar

### Desenvolvimento

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev
```

Abrir `http://localhost:3000`

### Produção

```bash
# Build de produção
npm run build

# Rodar build localmente
npm start
```

## 🛠️ Funcionalidades

### Página Principal (`/`)
- Header do player (nome, tag, arena, troféus, clã)
- Cards de resumo (melhor temporada, 3 coroas, winrate, trophy delta)
- Push atual (vitórias, derrotas, duração)
- Gráfico de troféus interativo
- Histórico de batalhas (últimas 20)

### API Endpoints
- `/api/player/:tag` - Dados do jogador
- `/api/player/:tag/battles` - Histórico de batalhas
- `/api/player/:tag/summary` - Resumo e estatísticas

## 🎯 Testes rápidos

Teste os endpoints diretamente:
- `http://localhost:3000/api/player/U9UUCCQ`
- `http://localhost:3000/api/player/U9UUCCQ/battles?last=20`
- `http://localhost:3000/api/player/U9UUCCQ/summary?last=20`

## 🔧 Correções aplicadas

### Timer Shims
- Adicionados shims para `setTimeout` e `setInterval` no client
- Previne erro `t._onTimeout is not a function` no Bolt
- Hook `usePolling` robusto para polling seguro

### Configuração Next.js
- Scripts corretos no `package.json`
- Porta 3000 configurada
- Proxy RoyaleAPI habilitado

## 🌐 Deploy

### Bolt Hosting
Use o botão **Publish** do Bolt para deploy direto.

### Vercel (Alternativo)
1. Suba o repo para GitHub
2. Na Vercel: **New Project → Import**
3. Adicione as variáveis de ambiente:
   - `SUPERCELL_TOKEN`
   - `USE_PROXY=true`
   - `DEFAULT_TAG=U9UUCCQ`
4. Deploy automático

## 📁 Estrutura do projeto

```
├── app/
│   ├── api/player/[tag]/          # API routes
│   ├── globals.css                # Estilos globais
│   ├── layout.tsx                 # Layout principal
│   └── page.tsx                   # Página principal (com timer shims)
├── components/                    # Componentes React
├── lib/                          # Utilitários
│   ├── supercell.ts              # Cliente Supercell API
│   ├── normalize.ts              # Normalização de dados
│   └── usePolling.ts             # Hook de polling robusto
├── .env.local                    # Variáveis de ambiente
├── next.config.js                # Configuração Next.js
└── tailwind.config.js            # Configuração Tailwind
```

## 🎨 Design

Interface dark inspirada no deep.gg com:
- Tema royal blue e gold
- Cards com bordas sutis
- Gráficos interativos
- Layout responsivo
- Micro-interações

## 🔧 Tecnologias

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Styling
- **Recharts** - Gráficos
- **Supercell API** - Dados do jogo
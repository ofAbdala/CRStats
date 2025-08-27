# 🔧 Clash Royale Status (Next.js + Supercell API)

App completo de estatísticas do Clash Royale usando **Next.js 14 (App Router)** e a **API oficial da Supercell**.
Interface inspirada no deep.gg com tema dark e gráficos interativos.

## ⚙️ Configuração

* **Framework**: Next.js 14 (App Router)
* **Porta**: 3000
* **Styling**: Tailwind CSS
* **Gráficos**: Recharts
* **API**: Supercell Official API

## 🔐 Variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
SUPERCELL_TOKEN=seu_token_aqui
USE_PROXY=true
DEFAULT_TAG=U9UUCCQ
```

> ⚠️ **Importante**: Use `USE_PROXY=true` se seu IP não estiver whitelisted na Supercell API.

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

## 🌐 Deploy

### Vercel (Recomendado)
1. Suba o repo para GitHub
2. Na Vercel: **New Project → Import**
3. Adicione as variáveis de ambiente:
   - `SUPERCELL_TOKEN`
   - `USE_PROXY=true`
   - `DEFAULT_TAG=U9UUCCQ`
4. Deploy automático

### Bolt Hosting
Use o botão **Publish** do Bolt para deploy direto.

## 📁 Estrutura do projeto

```
├── app/
│   ├── api/player/[tag]/          # API routes
│   ├── globals.css                # Estilos globais
│   ├── layout.tsx                 # Layout principal
│   └── page.tsx                   # Página principal
├── components/                    # Componentes React
├── lib/                          # Utilitários
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
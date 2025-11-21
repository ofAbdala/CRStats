# 🚀 Schema Application - Manual Steps (2 minutes)

Você já está logado no Supabase SQL Editor. Siga estes passos:

## Passo 1: Aplicar Schema Principal

1. **Abra o arquivo para copiar**:
   ```bash
   # No seu terminal:
   cat crstatus-monorepo/supabase/schema.sql | pbcopy
   ```
   
   Ou abra manualmente: `crstatus-monorepo/supabase/schema.sql`

2. **Cole no Supabase**:
   - Você já está aqui: https://supabase.com/dashboard/project/tjfzplxjsffddlvwtdtq/sql/new
   - Copie TODO o conteúdo do `schema.sql` (177 linhas)
   - Cole no editor SQL
   - Clique "Run" (ou Cmd+Enter)
   - Aguarde mensagem "Success" (deve aparecer em ~3-5 segundos)

## Passo 2: Adicionar Dados de Teste

1. **Copiar test data**:
   ```bash
   cat crstatus-monorepo/supabase/test-data.sql | pbcopy
   ```

2. **Nova query no Supabase**:
   - No SQL Editor, abra uma "New Query"
   - Cole o conteúdo do `test-data.sql`
   - Clique "Run"
   - Aguarde "Success"

## Passo 3: Verificar

Vá para **Table Editor** no Supabase:

- ✅ Deve ter 6 tabelas: `player_tags`, `players`, `battles`, `sessions`, `goals`, `events`
- ✅ Na tabela `players`: deve ter 1 registro (Test Player #ABC123)
- ✅ Na tabela `battles`: deve ter 17 registros

---

## Então estará pronto para testar! 🎉

Após aplicar, rode:
```bash
cd crstatus-monorepo
pnpm dev:web
```

Abra http://localhost:3000 e teste o fluxo completo!

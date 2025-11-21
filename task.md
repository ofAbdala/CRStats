# CR Status - Master Task List

## T1 – Sistema de Push por Sessão (CRÍTICO)
- [x] `lib/sessionDetector.ts` criado com tipos corretos
- [x] `detectSessions()` implementado (gap 30min, min 3 batalhas)
- [x] `SessionDetectionResult` retorna sessions + singles
- [x] Cálculo de estatísticas (winrate, trophyDeltaTotal, isActive)
- [x] `getSessionMessage()` com mensagens inteligentes
- [x] UI dos cards de sessão (ativa vs antiga)
- [x] Expand/collapse funcional
- [x] Seção "Batalhas Avulsas"

## T2 – Toggle de Visualização
- [x] Toggle "Por Sessão" / "Cronológico" implementado
- [x] "Por Sessão" como padrão
- [x] Tracking `history_view_mode_change`
- [x] Transições suaves entre modos

## T3 – Histórico FREE Refinado
- [ ] Filtros (resultado, modo, quantidade) - REVISAR
- [x] QuickSummaryCard com stats completas
- [x] Expand/Collapse de batalha individual
- [ ] Período filter (Hoje/3d/7d/Temporada) - ADICIONAR
- [ ] Aplicar filtros em QuickSummary - IMPLEMENTAR

## T4 – Analytics PRO (Histórico Estendido)
- [ ] Modo PRO busca last=100 batalhas - IMPLEMENTAR
- [ ] AdvancedBattleAnalytics completo - VERIFICAR
- [ ] Gráfico de progressão de troféus - TESTAR
- [ ] Stats por modo (gameMode) - COMPLETAR
- [ ] ProFeatureGate funcionando - OK

## T5 – Deck Analytics PRO + Deep Link
- [x] `buildDeckStats()` implementado
- [x] DeckAnalytics renderiza top decks
- [ ] Deep link de deck - IMPLEMENTAR
- [ ] Botão "Copiar deck" - ADICIONAR
- [ ] Tracking `deck_copy_link` - ADICIONAR
- [ ] Deep link em sessões/meta - INTEGRAR

## T6 – Insights e Tilt
- [x] `buildRuleBasedInsights()` com 10+ categorias
- [x] RuleBasedInsightsCard com design categorizado
- [x] Tilt detection em `analyzeTilt()`
- [x] Alertas visuais de tilt
- [ ] Integrar tilt em QuickSummary - ADICIONAR

##T7 – Filtros por Período + Heatmap
- [ ] Filtro de período (Hoje/3d/7d/Temporada) - IMPLEMENTAR
- [x] ActivityHeatmap (PRO) implementado
- [x] Grid dia x horário funcionando
- [x] ProFeatureGate no heatmap
- [ ] Integrar filtro com insights - CONECTAR

## T8 – Goals / Objetivos de Troféus
- [x] GoalsCard básico implementado
- [x] Meta de próxima liga
- [x] Meta de vitórias diárias
- [ ] Salvar em localStorage por tag - IMPLEMENTAR
- [ ] Criar/editar/remover metas - ADICIONAR
- [ ] Múltiplos objetivos PRO - IMPLEMENTAR

## T9 – Comparação de Jogadores
- [x] Página `/compare` existe
- [ ] Inputs para tagA e tagB - VERIFICAR
- [ ] Buscar dados dos dois players - TESTAR
- [ ] Exibir lado a lado - COMPLETAR
- [ ] Tracking `player_compare_view` - ADICIONAR
- [ ] Tracking `player_compare_run` - ADICIONAR
- [ ] UI refinada - POLIR

## T10 – Comunidade Refinada
- [x] GlobalLeaderboard implementado
- [x] CountryLeaderboard implementado
- [x] ClanLeaderboard implementado
- [x] Página `/clan/[tag]` implementada
- [x] MetaDeckList implementado
- [ ] Loading states - ADICIONAR
- [ ] Mensagens de erro - MELHORAR
- [ ] Deep link de decks meta - INTEGRAR

## T11 – Modo Streamer
- [x] `useStreamerMode` hook criado
- [x] Toggle no Dashboard
- [ ] Esconder sidebar/header - IMPLEMENTAR
- [ ] Layout limpo para live - TESTAR
- [ ] Mobile/desktop responsivo - VERIFICAR
- [ ] Tracking `streamer_mode_toggle` - OK

## T12 – trackEvent e Instrumentação
- [x] Eventos base implementados
- [x] `history_view_mode_change` - OK
- [x] `session_expand/collapse` - OK
- [ ] `deck_copy_link` - ADICIONAR
- [ ] `player_compare_*` - ADICIONAR
- [ ] Filtros - VERIFICAR
- [ ] Leaderboards clicks - VERIFICAR
- [ ] Revisar imports - AUDITAR

## T13 – QA / Code Review Final
- [ ] Revisão geral de código
- [ ] Imports quebrados - VERIFICAR
- [ ] Tipos inconsistentes - VERIFICAR
- [ ] Código duplicado - LIMPAR
- [ ] `npm run build` sem erros - TESTAR
- [ ] Runtime errors - VERIFICAR
- [ ] Checklist final - CRIAR
- [ ] Bugs documentados - CORRIGIR

---

## Legenda
- [x] Completo e testado
- [ ] Pendente / Não implementado

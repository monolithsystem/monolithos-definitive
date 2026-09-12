# Calibração final do estado "Planilha Vazia" (isEmptyButConnected)

## Objetivo
Separar claramente dois cenários de tela vazia:
- **Sem conexão / link falhou**: cards exibem `--` e mensagem atual de "Aguardando fluxo de registros ativos".
- **Conectado, mas planilha sem linhas válidas**: cards exibem `0`/`0%` e mensagens específicas de planilha vazia.

## Escopo
Alterações em três arquivos, mantendo intactos tema claro/escuro, PIN do diretor e polling silencioso a cada 10s.

## 1. `src/hooks/use-appointments.ts`
- Adicionar estado `isEmptyButConnected: boolean` e `loading: boolean` ao retorno do hook.
- Inicializar `appointments` como `[]` (remover dependência de `mockAppointments`, que já é vazio).
- Lógica de estados:
  - `VITE_SHEETS_URL` ausente, fetch com erro de rede ou HTTP não-2xx: `error = true`, `isEmptyButConnected = false`, `appointments = []`.
  - Resposta 200 OK, mas `parseCSV` retorna array vazio: `error = false`, `isEmptyButConnected = true`, `appointments = []`.
  - Resposta 200 OK com ao menos uma linha válida: `error = false`, `isEmptyButConnected = false`, `appointments = parsed`.
- Manter atualização a cada 10s sem estados de carregamento visíveis após a primeira tentativa.

## 2. `src/components/reception-view.tsx`
- Destruturar `error` e `isEmptyButConnected` do hook.
- Cards:
  - `error === true`: valor `--` (EMPTY_VALUE).
  - `isEmptyButConnected === true`: valor `0`.
  - Caso normal: valor real.
- Tabela vazia (sem busca ativa):
  - `error === true`: manter mensagem atual (`Aguardando fluxo de registros ativos` / `O motor de busca em tempo real está monitorando o sistema.`).
  - `isEmptyButConnected === true`: exibir `Agenda livre de registros ativos` / `Nenhum atendimento foi lançado no banco de dados para este período.`.
- Preservar comportamento de busca (quando `search` tem texto, mostrar "Nenhum paciente encontrado para esta busca").

## 3. `src/components/director-view.tsx`
- Destruturar `error` e `isEmptyButConnected` do hook.
- Cards:
  - `error === true`: valor `--`.
  - `isEmptyButConnected === true`: valor `0` ou `0%`.
  - Caso normal: valor real.
- Gráficos (área e pizza):
  - `error === true`: manter mensagem atual (`Painel estratégico aguardando sincronização` / `Insira novas movimentações...`).
  - `isEmptyButConnected === true`: exibir `Monitoramento estratégico em espera` / `Conexão estável. Insira novas movimentações de pacientes para projetar os indicadores de procedimentos e taxas de confirmação.`.
- Preservar lógica de desbloqueio por PIN e transições visuais douradas.

## Validação
- TypeScript sem erros.
- Build de produção passando.
- Testar visualmente modos claro e escuro nos estados: com dados, planilha vazia conectada e sem conexão.

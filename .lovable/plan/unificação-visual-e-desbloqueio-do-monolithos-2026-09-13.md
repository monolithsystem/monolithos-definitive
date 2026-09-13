# Unificação visual e desbloqueio do MonolithOS

## Alterações
- Reestruturar os estilos de status em propriedades separadas de fundo, texto e borda, usando apenas transparências suaves e as cores especificadas para cada estado.
- Atualizar a pílula de status da Recepção com borda, sombra leve e bolinha indeformável, preservando as contagens dos cards.
- Corrigir a categoria “Em Transição” do gráfico para incluir agendados, pendências, espera de confirmação e qualquer reagendamento.
- Tornar o PIN automático no último dígito correto, exibindo imediatamente cadeados abertos e a animação azul de sucesso.
- Aplicar a saída cinematográfica em duas etapas: início do desaparecimento aos 450 ms e abertura do painel após mais 1100 ms.

## Preservação
- Manter as funções antigas, o comportamento de erro do PIN, os dados reais, os estados de planilha vazia e os modos claro/escuro.

## Validação
- Conferir compilação, desbloqueio automático, transição visual e renderização dos status no preview.

## Detalhes técnicos
- A interface de estilo passará a expor `bg`, `text`, `border`, `hex` e `pulse`.
- A regra específica do donut será isolada no Painel do Diretor para não alterar outros indicadores ativos.
- Temporizadores serão limpos ao desmontar a tela para evitar atualizações tardias.

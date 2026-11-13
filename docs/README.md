# Documentação do projeto

Entrada principal para entender **a plataforma, cada produto e o andamento**, sem confundir requisito com entrega. Organização revisada em 2026-11-13 na [TASK-081](../tasks/completed/TASK-081-documentation-organization.md).

## Escolha a área

| Área | Para que existe | Comece aqui |
|---|---|---|
| Plataforma QRCodex | Infraestrutura compartilhada, tenancy, segurança e operação | [Plataforma](platform/README.md) |
| Site Relica's | Descoberta da casa, shows, cardápio e contato | [Site](site/README.md) |
| Cardápio | Consulta pública de produtos, preços e disponibilidade | [Cardápio](menu/README.md) |
| Agenda | Publicação e consulta de eventos do estabelecimento | [Agenda](agenda/README.md) |
| Hub | Entrada por slug/QR para experiências disponíveis | [Hub](hub/README.md) |
| Música | Pedidos FIFO, TV e operação pelo dono | [Música](music/README.md) |
| Admin | Um ambiente de gestão, com áreas por domínio | [Admin](admin/README.md) |
| Experimentos | Hipóteses e evidências de POCs, sem aceite de produção implícito | [Experimentos](experiments/README.md) |
| Histórico e referências | Propostas antigas e materiais de origem | [Arquivo](archive/README.md) |

Essas áreas são fronteiras de documentação e responsabilidade dentro de **uma aplicação e um Supabase**. Não representam novos aplicativos, bancos, logins ou um catálogo de módulos genérico.

## Qual fonte responde a cada pergunta?

| Pergunta | Fonte responsável |
|---|---|
| Qual é a visão e o escopo aprovado? | [PRD](PRD.md), com detalhamento no índice do produto |
| O que fazer agora? | [CURRENT](../tasks/CURRENT.md) |
| Qual o estado de uma entrega? | [BACKLOG](../tasks/BACKLOG.md) e arquivo da tarefa com aceite/evidências |
| Como os domínios convivem? | [Arquitetura](ARCHITECTURE.md) |
| Quais tabelas, RLS, grants e buckets existem? | [Banco e segurança](DATABASE.md), migrations e testes SQL |
| Quais convenções visuais aplicar? | [Design system](DESIGN_SYSTEM.md) e tema específico da superfície |
| Por que essa decisão foi tomada? | [Decisões](DECISIONS.md) |
| Como preparar uma publicação? | [Deployment](DEPLOYMENT.md) e runbook do produto |
| Como manter tudo sincronizado? | [Governança documental](GOVERNANCE.md) e [fluxo de tarefas](../tasks/README.md) |
| Onde está o cadastro completo das docs? | [Catálogo documental](CATALOG.md) |
| O que esta revisão conciliou? | [Auditoria documental](AUDIT-2026-11-13.md) |

## Leitura prática

1. Leia `AGENTS.md`, CURRENT e a tarefa selecionada.
2. Consulte este índice e a entrada da área afetada.
3. Leia os contratos globais aplicáveis e os documentos temáticos indicados pela tarefa.
4. Inspecione o código antes de afirmar que um requisito está implementado.

Os documentos técnicos existentes conservam seus caminhos para não quebrar tarefas e referências. Os índices por domínio apontam para os contratos responsáveis, sem criar cópias concorrentes. Estado de produção aqui significa **último registro disponível**, nunca uma inspeção remota nova.

# Governança da documentação

## Regra principal

Cada informação tem uma fonte responsável. Atualize essa fonte na mesma tarefa que altera o comportamento e use links nas demais áreas. Nenhum processo garante atualização sozinho: o fechamento da tarefa deve verificar a matriz abaixo. Validação mecânica: `node scripts/check-docs.mjs`.

O [catálogo](CATALOG.md) cadastra os documentos e sua função. Ao criar, mover ou retirar uma doc, atualize-o e seus links; o relatório de auditoria datado preserva as conclusões daquela revisão, sem virar registro permanente de status.

## Tipos de documento

| Tipo | Responsabilidade | O que não comprova |
|---|---|---|
| Contrato vigente | Escopo, regras e restrições aprovadas | Que já foi implementado ou publicado |
| Índice de domínio | Propósito, fronteiras e links para contratos/tarefas/código | Uma segunda especificação ou backlog |
| Tarefa | Trabalho delimitado, estado, aceite, evidências e próximo passo | Aprovação de release apenas por passar build |
| Runbook | Procedimento operacional e gates de release/recuperação | Autorização para executá-lo agora |
| Evidência datada | O que foi observado, onde e com quais limites | O estado remoto atual indefinidamente |
| Proposta/experimento | Hipótese e resultado limitado ao seu escopo | Compromisso de implementação ou aceite comercial |
| Referência histórica | Origem preservada de decisões/propostas | Instrução vigente ou nova prioridade |

Evite novos arquivos `STATUS.md` que copiem todo o backlog. Nos índices, descreva a capacidade e aponte para as tarefas responsáveis pelo progresso. Quando uma fotografia de estado for necessária, registre data, fonte e limites.

## Responsabilidade por mudança

| Mudança | Atualizar na mesma entrega |
|---|---|
| Visão ou escopo aprovado | PRD; contrato do produto afetado; decisão se material |
| Regra de Cardápio | PRD §§5, 8–11; arquitetura/banco/design se afetados; índice `menu/` se mudar fronteira ou referência |
| Regra de Agenda | PRD fase B; arquitetura/banco/design de eventos; `site/03-CONTENT-AND-ADMIN.md` se mudar o consumo institucional |
| Regra de Hub/QR | PRD §§6, 12, 15; arquitetura; compatibilidade do site; TASK-028 quando pertinente |
| Regra de Música | MUSIC_PRODUCTION; runbook quando operacional; banco/design/decisões afetados; preservar os limites das POCs |
| Regra do site | Documento temático em `site/`; PRD quando mudar escopo; contrato do domínio reutilizado se afetado |
| Admin/Auth/settings | PRD §5; arquitetura de acesso; banco/design conforme impacto; domínio dono da operação |
| Infraestrutura, schema, RLS ou Storage | ARCHITECTURE/DATABASE, migrations e evidências; DEPLOYMENT se afetar operação |
| Convenção de UI | DESIGN_SYSTEM e tema específico; não aplicar tokens do site globalmente |
| Decisão material ou substituição | DECISIONS com contexto, alcance e decisão anterior substituída |
| Progresso | Arquivo da tarefa + BACKLOG + CURRENT; corrigir links quando mover a tarefa |
| Release executado | Tarefa/runbook com alvo, versão, autorização específica, verificações e limites; DEPLOYMENT com registro datado |
| Guia do dono | Fonte Markdown e artefato exportado juntos; não editar só o PDF |

Uma mudança no loader de eventos pode afetar Agenda, Hub e site. Uma mudança em settings pode afetar identidade, Cardápio e contato do site. Faça a revisão desses consumidores na tarefa, sem duplicar tabelas ou lógica.

## Resolver conflitos

1. Separe **requisito**, **implementação local**, **publicação registrada** e **aceite pendente**. São afirmações diferentes.
2. Consulte instruções atuais do usuário/AGENTS, decisões aceitas aplicáveis, contrato responsável, tarefa e evidência. Uma nota mais nova só substitui a anterior no alcance que registra; não generalize permissões de Música para site.
3. Compare código/migrations para o estado local. Para produção, cite a última evidência datada; qualquer verificação remota nova depende do escopo autorizado.
4. Corrija a frase vigente. Em decisões substituídas, marque a substituição; em evidências antigas, preserve a observação e identifique seu contexto histórico.
5. Se o material não resolve uma escolha de produto, registre pendência com efeito e tarefa responsável. Não invente fatos do bar, schema ou aceite.

O PRD global define visão e limites compartilhados; o documento específico detalha seu domínio. Um detalhe do site não pode enfraquecer tenant/RLS nem mudar Música. Divergências entre contratos vigentes devem ser conciliadas e registradas, não resolvidas seguindo silenciosamente o arquivo de maior tamanho ou a data mais recente.

## Ciclo obrigatório de atualização

**Ao iniciar:** CURRENT → tarefa → índice do domínio → contratos pertinentes → código. Identifique dependências e os documentos que a alteração pode afetar.

**Durante:** mantenha regras na fonte responsável. Registre evidências com comando/cenário, resultado, ambiente e limitações. Nunca inclua valores de segredos, cookies, códigos de TV ou backups.

**Ao concluir:** confira cada critério; atualize os contratos; registre o que mudou e os checks; mova a tarefa concluída; atualize BACKLOG/CURRENT e links; execute o verificador documental. Não marque DONE com aceite manual pendente.

**Antes de release ou mudança transversal:** repasse os índices dos consumidores afetados e confirme que os relatos de deploy não foram confundidos com nova verificação. Números de testes e commits pertencem às evidências, não a introduções que pretendem descrever o presente.

## Estado das tarefas

Estados oficiais: `PLANNED`, `READY`, `IN_PROGRESS`, `BLOCKED`, `DONE`. `READY_FOR_MANUAL_VALIDATION` é uma qualificação de validação, não um sexto estado. Diretório `active/` também contém pendências bloqueadas; não significa que todas sejam implementação simultânea.

Normalmente há uma implementação em execução. TASK-058 e TASK-061 conservam seu IN_PROGRESS histórico com validação manual pendente, sem ocupar a prioridade de implementação do site. Essa exceção deve permanecer explícita em CURRENT; esta organização não as conclui nem reabre os endpoints antigos.

## Limites da verificação automática

`check-docs` verifica destinos de links Markdown locais, cadastro das docs, unicidade dos IDs e coerência de status/localização entre backlog e tarefas, além do ponteiro de próxima implementação em CURRENT. Não verifica a verdade de frases, autorização, renderização de UI ou produção. Referências históricas preservadas são inventariadas, mas seus antigos links e estados não participam da validação de contratos vigentes.

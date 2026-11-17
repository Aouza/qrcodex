# Decisões e pendências

## Direção consolidada
ADR-020: evoluir a aplicação existente; homepage institucional, menu/Agenda reutilizados, admin único e compatibilidade aditiva. ADR-022 (2026-11-17) substitui a apresentação anterior por `reference/layout-aprovado.png`: preto/creme/vermelho/bronze, sem papel da Agenda ou Galeria. Requisitos reconciliados substituem scaffold/segundo app do ZIP. Aprovação visual não confirma conteúdo factual ou release.

## Escolhas técnicas delegadas às tarefas
Route group e contexto server-side allowlisted; extração mínima de componentes; leitura dinâmica inicial; testes existentes preservados. Família tipográfica, nomes finais de helpers e schema institucional devem ser definidos pela tarefa responsável com critérios concretos e sem framework genérico. Não exigem nova confirmação para detalhes rotineiros dentro do escopo.

## Gates externos e editoriais
| Pendente | Efeito |
|---|---|
| Host canônico real, propriedade, DNS/HTTPS | bloqueia cutover/QR/SEO final, não local/Preview configurado |
| Fotos reais e permissão, marca vetorial, Hero | bloqueia publicação visual; revisão pode usar conceito identificado |
| Endereço, horários, contatos e destinatário | bloqueia conteúdo operacional de produção |
| Campos institucionais exatos | definir na TASK-073; não executar migration com schema presumido |
| Galeria no lançamento? | retirada do layout vigente pela ADR-022; eventual retorno exige nova solicitação |
| Cancelamento/couvert/prévia/detalhe/manual order | opcionais, sem migrations implícitas |
| Recuperação completa e ambiente de ensaio | gate anterior a alterações remotas; backup Music exclui Auth/Storage |
| QR/links distribuídos e colisões de slugs | verificar antes de rotas estáticas/redirecionamentos |
| Música: físico/duração/privacidade/comercial/monitoramento | permanece em TASK-058, independente do site |

O endereço, horário, telefone e usuário Instagram citados no pacote original são indícios não verificados. Não publicar a partir de screenshots. Conteúdo inexistente deve aparecer como pendência em revisão, não como fato inventado.

## Limites de autorização
O usuário autorizou atualizar documentos para iniciar o site. Não autoriza commit/push/deploy, DNS, novas credenciais ou migrations/dados remotos por inferência. Trabalho local futuro segue a tarefa ativa. Permissões anteriores específicas de Música não se generalizam ao site.

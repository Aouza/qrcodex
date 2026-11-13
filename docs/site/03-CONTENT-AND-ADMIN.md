# Conteúdo e administração

## Fonte única
Maurício usa o admin atual: produtos/categorias para menu, eventos para Agenda, settings para identidade e futuros campos institucionais. Sem novo login, editor paralelo ou CMS genérico. Cada ação resolve sessão/membership e tenant no servidor, valida fronteira e mantém RLS.

## Contrato de eventos existente
| Campo | Regra |
|---|---|
| `id`, `establishment_id` | identidade e tenant, preservados |
| `title` | obrigatório |
| `description` | opcional, texto |
| `starts_at`, `ends_at` | instantes timestamptz; fim opcional e não anterior |
| `image_url` | obrigatório para `active=true` |
| `external_url` | opcional, HTTP(S) validado |
| `active` | rascunho/publicado; não é enum de cancelamento |

`PublicAgendaEvent` em `src/lib/agenda/resolve-public-agenda-result.ts` é o contrato público existente. Não copiar o tipo proposto no ZIP com `slug`, `admissionLabel` e `cancelled` como se fosse schema real. Sem fim, a relevância termina no início; confirmar instrução de uso ao proprietário. Filtro: fim ou início >= agora, ordenação por início/ID, fuso de exibição America/Sao_Paulo.

Fluxo existente: criar rascunho → anexar flyer → publicar → editar/despublicar; exclusão permanente com confirmação. Remover flyer despublica. Prévia autenticada/cancelamento/couvert/slugs/detalhe/reordenação manual ficam fora do primeiro incremento até decisão explícita.

Validação local (TASK-065): início e fim usam o formato `YYYY-MM-DDTHH:mm` e devem existir no calendário, com hora 00–23 e minuto 00–59. Datas impossíveis e `24:00` são rejeitados, não normalizados. O contrato atual de entrada permanece `-03:00` para São Paulo; `2026-10-02T22:00` vira `2026-10-03T01:00:00.000Z`. Fim pode ser igual ao início ou ocorrer na madrugada seguinte, nunca antes. A correção não altera instantes já persistidos nem define uma política nova para outros fusos/datas históricas.

## Institucional planejado
TASK-073 define schema tipado para headline/apresentação/textos da casa, endereço e horários. TASK-074 entrega edição em settings e leitura pública. Não duplicar nome/logo/Instagram/WhatsApp já existentes. Definir limites, valores ausentes, campos públicos e defaults antes da migration. Config local pode suportar Preview identificado, mas não substitui a autonomia exigida para os campos aprovados.

Galeria inicial pode ser estática e aprovada. Uploader e ordenação no admin dependem de tarefa própria. O CTA `Reserve sua mesa` usa o WhatsApp público cadastrado em Configurações. Com o número disponível, abre a conversa com mensagem inicial predefinida, que o visitante pode editar no WhatsApp; não há editor desse texto no admin atual. Sem o número, leva à seção Contato. A home lê apenas WhatsApp e Instagram da linha ativa do Relica’s por meio do cliente público.

## Mídia e segurança
Buckets existentes públicos: produto, categoria, estabelecimento e evento; JPEG/PNG/WebP até 768 KB, escrita protegida por tenant/recurso. URL de flyer de rascunho pode ser acessível diretamente: publicação da linha não é confidencialidade do arquivo. TASK-066 confirma rascunho sem mídia antes de remover arquivo/linha, mantendo a linha exigida pela RLS durante a limpeza. Falha de Storage pode recuperar somente a referência em rascunho; falha de compensação exige revisão. Na substituição, novo flyer vinculado é preservado se a limpeza do antigo falhar. Falhas parciais retornam erro e invalidam consumidores atuais; não há transação atômica ou republicação automática. Recuperação de órfãos e limites estão em [DATABASE](../DATABASE.md#event-media-recovery--local-task-066).

## Atualização pública
Criar/editar/publicar/despublicar/excluir e trocar imagem devem atualizar consumidores pertinentes, inclusive home nova e aliases. Testar o comportamento real em build/start; prazo de refresh e limites de aba aberta registrados, sem promessa de push inexistente.

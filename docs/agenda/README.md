# Produto — Agenda

## Propósito

Publicar shows/eventos reais de cada estabelecimento e permitir consulta cronológica. A mesma fonte alimenta a Agenda pública, a disponibilidade no Hub e a futura seção do site. Não usar produtos como eventos nem criar outra agenda editorial.

## Fontes responsáveis

| Assunto | Fonte |
|---|---|
| Escopo | [PRD](../PRD.md), fase B |
| Loaders e fronteira de acesso | [Arquitetura](../ARCHITECTURE.md), Agenda domain |
| `events`, publicação, RLS e `event-images` | [Banco](../DATABASE.md) |
| Apresentação legada | [Design system](../DESIGN_SYSTEM.md), §48 |
| Uso institucional e regra de datas | [Conteúdo e admin do site](../site/03-CONTENT-AND-ADMIN.md) |
| Aparência institucional | [Design do site](../site/02-DESIGN-SYSTEM.md) |

## Contrato existente

`/[slug]/agenda` e `/admin/events` estão implementados. Eventos têm título, descrição opcional, início/fim, flyer, link externo opcional e `active` como rascunho/publicado. Publicar exige imagem. Não há campos próprios de slug, cancelamento, couvert ou ordenação manual.

Relevância usa `(ends_at ?? starts_at) >= agora`, com igualdade incluída; sem fim, o evento deixa de ser relevante depois do início. Ordenação é início/ID e a exibição usa America/Sao_Paulo. A TASK-064 corrigiu localmente os loaders de Hub/Agenda: ambos aplicam o filtro temporal na consulta, antes do limite do Hub. O helper `src/lib/agenda/public-event-time.ts` concentra o filtro e a checagem defensiva dos resolvers. A correção local não comprova publicação em produção.

RLS controla publicação/tenant, não expiração por data. URLs de mídia em bucket público não se tornam privadas quando o evento vira rascunho. Mudanças de eventos devem considerar Hub, Agenda e cada consumidor institucional existente naquele momento.

## Código e evidência

`src/lib/agenda/`, `src/lib/hub/`, `src/app/[slug]/agenda/`, `src/app/admin/(protected)/events/`, `src/lib/validation/event.ts`, migrations de eventos/mídia e testes SQL `011`/`012`. Regressão pública e de validação está em `tests/load-public-agenda.test.mjs`, `load-public-hub.test.mjs`, `event-validation.test.mjs` e `event-image-validation.test.mjs`.

## Andamento e pendências

[BACKLOG](../../tasks/BACKLOG.md), epic Agenda, registra TASK-048–052. A seleção temporal foi corrigida na [TASK-064](../../tasks/completed/TASK-064-site-event-selection.md). Próximas correções e integração estão em [TASK-065](../../tasks/active/TASK-065-site-event-calendar-validation.md), [TASK-066](../../tasks/planned/TASK-066-site-event-media-recovery.md), [TASK-069](../../tasks/planned/TASK-069-site-agenda-route.md) e [TASK-072](../../tasks/planned/TASK-072-site-home-agenda.md). Embora cadastradas no epic Site, 064–066 corrigem o domínio compartilhado. O nome do epic não restringe os consumidores que devem ser verificados.

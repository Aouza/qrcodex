# Arquitetura institucional

Decisão vigente: ADR-020 em `../DECISIONS.md`. Uma aplicação Next.js, serviços Supabase existentes e admin único. Stack instalada permanece; não fazer scaffolding, monorepo ou troca de ferramentas como pré-requisito.

## Estrutura incremental proposta
```text
src/app/layout.tsx                    # único root layout
src/app/(site)/layout.tsx             # wrapper/tema institucional
src/app/(site)/page.tsx               # substitui src/app/page.tsx na tarefa de home
src/app/(site)/cardapio/page.tsx      # compartilhado com menu legado
src/app/(site)/agenda/page.tsx        # compartilhado com Agenda legada
src/app/[slug]/                       # contratos existentes
src/app/admin/(protected)/            # shell/membership existentes
src/app/api/                          # endpoints preservados
src/components/site/                 # seções institucionais
src/components/menu/                 # apresentação de catálogo existente
src/components/agenda/               # apresentação extraída quando usada
src/lib/site/                        # contexto/composição do site
src/lib/{menu,agenda,hub,auth,supabase}/
```
Os caminhos novos são propostas de implementação. Não manter duas páginas que resolvam `/`. Não criar wrapper visual de site sobre TV/admin nem duplicar `<main>` nos componentes compartilhados.

## Contexto e segurança
Configuração server-only mapeia hosts normalizados explicitamente aprovados para Relica's. Inspecionar headers confiáveis reais da hospedagem; não confiar em host arbitrário enviado em formulário ou X-Forwarded-Host não validado. Local/Preview precisa de configuração explícita; não aceitar todo `*.vercel.app` como tenant por conveniência. Host desconhecido não resolve a superfície institucional. Shared slug continua com resolução atual. Colisões de slugs reservados são gate da TASK-067.

Menu/Agenda públicos usam cliente anônimo sem cookie administrativo. Admin usa `getAdminAccess`, membership e RLS. Nenhuma nova service-role editorial. Music mantém sua exceção server-only restrita.

## Dados e atualização
Loaders existentes são a fonte comum; não criar API/HTTP de integração interna só para compartilhar dados. Páginas carregam e compõem; componentes recebem dados e destinos de navegação. Limitar eventos depois do filtro temporal e preservar os em andamento. Reutilizar regra central entre home/Agenda/Hub sem duplicar o predicado.

Leitura dinâmica inicial, com teste em build/start. Centralizar caminhos consumidores de publicação/edição/exclusão e settings; testar nova navegação e histórico do navegador. Não prometer atualização instantânea em uma aba já aberta sem mecanismo específico. Futuro cache persistente depende de tenant, invalidação e expiração temporal, não apenas mutações.

## Trade-offs
Aplicação única economiza infra e evita sincronização; exige regressão conjunta e CSS local. Segundo app/link externo fragmenta navegação e release; proxy/API compartilhada cria novos contratos sem necessidade atual. Nenhuma remoção por preferência arquitetural.

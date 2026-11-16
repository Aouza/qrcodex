# Área compartilhada — Admin

## Propósito

Um login e um estabelecimento resolvido no servidor, com áreas independentes para gestão. Não criar outro painel para o site ou para cada produto.

| Área | Destinos existentes | Responsabilidade |
|---|---|---|
| Visão geral | `/admin` | Resumos e atalhos |
| Cardápio | `/admin/products`, `/admin/categories` | Catálogo e mídia |
| Agenda | `/admin/events` | Eventos, flyers e publicação |
| Música | `/admin/music` | Fila, pareamento, revogação e controles operacionais |
| Estabelecimento | `/admin/settings` | Identidade, logo e contatos atuais |
| Conta | `/admin/account` | Senha e segurança |

## Fontes responsáveis

[PRD](../PRD.md) §5; [arquitetura](../ARCHITECTURE.md), Unified admin information architecture; [banco/RLS](../DATABASE.md); [design](../DESIGN_SYSTEM.md) §33; ADR-017 em [decisões](../DECISIONS.md). Regras de produtos/eventos/Música pertencem aos respectivos domínios, mesmo quando a ação é administrativa.

## Fronteira de acesso

Layout protegido, loaders e cada mutação verificam acesso; o Proxy é proteção inicial, não autorização final. `getAdminAccess` exige uma membership; zero/múltiplas produzem estado controlado. Nenhum ID enviado pelo browser escolhe a autorização. Sem sign-up público, CMS genérico ou service-role editorial. RPCs de administração de Música usam a sessão/membership, não a credencial da TV.

## Implementação e pendências

Shell/ações em `src/app/admin/(protected)/`, `src/components/admin/`, `src/lib/auth/`, loaders e validações. O shell autenticado é claro; menu/Hub/TV e site têm temas próprios.

[TASK-059](../../tasks/completed/TASK-059-document-unified-admin-information-architecture.md) registra a organização aprovada. [TASK-031](../../tasks/active/TASK-031-account-password-security.md) tem implementação de senha e aceite manual pendente. Conteúdo institucional editável depende de [TASK-073](../../tasks/planned/TASK-073-site-editorial-schema.md)/[TASK-074](../../tasks/planned/TASK-074-site-editorial-admin.md); não presumir campos de endereço/horários ou galeria já existentes.

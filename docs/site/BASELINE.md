# Linha de base antes da navegação institucional

Verificação local em `feat/music-production`, HEAD `b3d174f`. O checkout já continha alterações de documentação, materiais de Música e a nova referência em `docs/site/refs/`. `src/`, `tests/` e `package.json` estavam sem diffs rastreados. A navbar usa este checkout para aproveitar os documentos locais e a referência, com alterações limitadas à raiz e aos componentes do site.

## Verificações
- `npm.cmd run lint`, `npm.cmd run typecheck`, `node --test --test-reporter=dot tests/*.test.mjs` (97 testes) e `npm.cmd run build` passaram antes da primeira mudança funcional.
- O build lista `/` como starter estático e as rotas atuais `/[slug]`, `/[slug]/agenda`, `/[slug]/cardapio`, admin e Música.

## Contratos e ambientes
- Preservar `/relicas`, `/relicas/cardapio`, `/relicas/agenda`, `/relicas/musicas`, player, APIs e admin. QR permanente depende do domínio validado. Inventário de QR impressos e colisões de slugs ainda requer confirmação.
- A configuração local inclui `.env.local` e `.env.production.local`. O build encontrou ambos. Os nomes das variáveis constam em `.env.example`. O alvo remoto e a separação do banco de Preview seguem pendentes de verificação antes de qualquer escrita.
- Histórico de ensaio de Música em CURRENT e TASK-058. A recuperação registrada cobre banco no escopo indicado e depende deste perfil Windows via DPAPI. Auth e arquivos do Storage requerem recuperação própria.
- Antes de mudança remota, validar origem de backup, histórico de migrations e ensaiar restauração no ambiente isolado. O rollback do site usa aplicação compatível com o schema aditivo.

## Jornada manual a validar
1. Abrir Hub, buscar e limpar busca no cardápio, conferir preço, produto sem foto e estado esgotado.
2. Abrir Agenda com evento publicado e verificar que rascunhos ficam ocultos.
3. Em ambiente de teste, entrar no admin, editar um produto, publicar/despublicar evento e conferir as superfícies públicas.
4. Validar TV e pedidos com dois celulares segundo TASK-058.

Essas jornadas físicas, o inventário remoto e a recuperação completa permanecem pendentes.

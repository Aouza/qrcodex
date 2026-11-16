# Relica's Rock & Bar
## Guia de uso da Música

Versão de 30/09/2026 - teste acompanhado com o dono. O recurso ainda está em validação; este guia não representa liberação comercial definitiva.

### 1. O que você precisa

- Um computador conectado à TV e ao sistema de som do bar.
- Internet funcionando e um navegador atualizado no computador.
- Seu acesso ao admin, usado no celular ou em outro computador.
- Para testar pedidos, dois celulares com acesso à internet.

A TV só reproduz os vídeos. A administração da fila fica no painel do bar. Não deixe sua conta de administrador aberta no equipamento da TV.

### 2. Endereços para salvar

- **Admin Música:** https://qrcodex-eight.vercel.app/admin/music
- **Player da TV:** https://qrcodex-eight.vercel.app/relicas/musicas/player
- **Pedidos no celular:** https://qrcodex-eight.vercel.app/relicas/musicas
- **Hub do bar:** https://qrcodex-eight.vercel.app/relicas

Use esses endereços oficiais, não os links temporários de deploy.

### 3. Preparar a TV pela primeira vez

1. Entre no **Admin Música** com sua conta do bar.
2. Marque **Música habilitada** e **Receber novos pedidos**. Clique em **Salvar configuração**.
3. Clique em **Gerar código para TV**. O código tem 8 caracteres, no formato `XXXX-XXXX`.
4. No computador conectado à TV, abra o endereço do **Player da TV**.
5. Digite o código, leia e aceite a política e os termos apresentados e clique em **Parear TV**. O hífen é opcional; letras maiúsculas ou minúsculas funcionam.
6. Se aparecer **INICIAR PLAYER**, clique uma vez. Confira a saída de áudio e o volume do computador e da TV.
7. No admin, clique em **Atualizar fila** e confirme **TV: online e pronta**.
8. Deixe a aba da TV aberta. No celular de pedidos, recarregue a página depois que a TV estiver pronta.

O código vale por 10 minutos e só pode ser usado uma vez. Não publique nem compartilhe o código com clientes. A TV normalmente mantém a autorização no mesmo navegador por até 30 dias; limpar cookies, usar modo anônimo, revogar ou substituir a TV pode exigir novo pareamento.

<!-- pagebreak -->

## Durante o funcionamento

### 4. Como o cliente pede uma música

1. Abra **Pedidos no celular**, ou entre em **Músicas** pelo Hub.
2. Leia a política de privacidade e os Termos do YouTube; aceite para continuar.
3. Digite pelo menos **3 caracteres**: nome da banda, música ou ambos. Clique em buscar.
4. Escolha o vídeo desejado e envie o pedido.
5. Aguarde a confirmação **Pedido recebido!**. Não envie repetidamente o mesmo pedido.

Os pedidos entram por ordem de chegada. Uma nova música não interrompe a que está tocando. Ao terminar, a TV deve iniciar a próxima automaticamente. Quando a fila acaba, aparece **Aguardando pedidos...**; isso é normal. Não existe playlist de fundo automática.

Um vídeo indisponível pode falhar e a fila deve seguir para o próximo. Um pedido não garante reprodução. Há limites de pedidos, tentativas e busca para proteger o serviço; se surgir um aviso de limite, aguarde.

### 5. Controles do dono no admin

- **Receber novos pedidos:** desmarcar pausa os pedidos, mas mantém a reprodução da fila já aceita. Clique em **Salvar configuração**.
- **Música habilitada:** desmarcar desativa o recurso e para a TV, preservando a fila. Clique em **Salvar configuração**.
- **Pular música atual:** encerra o pedido atual e avança para o próximo. Confirme apenas se realmente quiser pular.
- **Remover pedido:** retira da fila uma música que ainda não começou. Não remove a música atual.
- **Atualizar fila:** consulta novamente o estado da TV e da fila.
- **Substituir TV:** invalida a autorização anterior e gera um novo código. A reprodução anterior será interrompida; use para trocar o equipamento ou navegador.
- **Revogar autorização:** retira a autorização da TV e invalida códigos pendentes. A fila é preservada; para voltar, será necessário gerar um código e parear novamente.

### 6. Abrir e fechar a operação

**Ao abrir o bar:** abra o player no mesmo navegador da TV, ative se solicitado e confirme no admin que está online e pronto. Habilite o recebimento de pedidos quando estiver preparado.

**Ao encerrar:** desmarque **Receber novos pedidos** e salve. Para parar a reprodução, desmarque **Música habilitada** e salve. Depois feche a aba da TV, se desejar.

Fechar a TV não apaga imediatamente a fila. O serviço deixa de considerá-la online após a autorização de reprodução expirar. Se atualizar ou reabrir o player, a música atual pode recomeçar do início.

<!-- pagebreak -->

## Problemas comuns e teste rápido

### 7. Se algo não funcionar

**“Player offline” ou “pedidos pausados”**
Confira as duas opções no admin, a internet da TV e se **INICIAR PLAYER** foi acionado. Mantenha a aba aberta. Quando aparecer **online e pronta**, recarregue a página de pedidos no celular.

**“Código inválido, expirado ou limite de tentativas”**
Confira os 8 caracteres. Não há `0`, `1`, `I` ou `O`. Se expirou, gere um novo código; se atingiu o limite, aguarde antes de tentar novamente. Se já existe uma TV autorizada e você quer trocá-la, use **Substituir TV**.

**“Outra aba ou TV está utilizando o player”**
Feche a outra aba do player e mantenha apenas uma. Se estiver trocando de equipamento, use **Substituir TV** no admin.

**Vídeo aparece, mas não há som**
Confira volume, modo mudo e saída de áudio do computador/TV. Se aparecer **INICIAR PLAYER**, clique. Não confunda o volume do computador com o do sistema de som do bar.

**“Aguardando pedidos...”**
Não é erro: a fila está vazia. Com a TV pronta e os pedidos habilitados, um novo pedido deve iniciar automaticamente.

**“Música temporariamente indisponível” ou “Não foi possível acessar o YouTube”**
Confira a internet, recarregue a página e tente novamente. Se persistir, registre o horário, o texto pesquisado e uma captura da mensagem para enviar ao responsável técnico. Nunca envie senha ou código de pareamento.

**“A busca atingiu o limite disponível”**
A busca tem uma cota diária. Neste teste, o aplicativo está limitado a 80 buscas por dia, compartilhadas entre os usuários. Não repita tentativas continuamente; avise o responsável técnico.

### 8. Teste de aceitação com o dono

1. Prepare a TV e confirme **online e pronta**. Depois, não mexa no computador da TV.
2. No celular A, peça **Deftones - Change**. Confira se começa na TV.
3. Enquanto toca, no celular B peça **Thornhill - Obsession**. Deftones deve continuar, sem interrupção.
4. Deixe Deftones terminar. Thornhill deve começar automaticamente.
5. Enquanto Thornhill toca, peça **Loathe - Two-Way Mirror** pelo celular A.
6. Ao terminar Thornhill, Loathe deve começar automaticamente. No final, a TV deve voltar a **Aguardando pedidos...**.
7. Teste também pausar novos pedidos, pular e remover pelo admin. Faça testes de desconexão e vídeo indisponível com acompanhamento técnico.

Se algum passo exigir intervenção entre músicas, anote o que aconteceu. O teste real com TV e celulares ainda é necessário para concluir a validação. Questões de privacidade, termos e direitos para uso no estabelecimento seguem como etapas separadas da liberação definitiva.

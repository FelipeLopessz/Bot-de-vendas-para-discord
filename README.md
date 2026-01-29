# Template de Bot de Vendas para Discord (com Verificação Manual)

<p align="center">
  <img src="https://private-user-images.githubusercontent.com/246140774/518838666-b5973c1a-542e-43cf-a019-5810bd10d866.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NjQxMDE2MjIsIm5iZiI6MTc2NDEwMTMyMiwicGF0aCI6Ii8yNDYxNDA3NzQvNTE4ODM4NjY2LWI1OTczYzFhLTU0MmUtNDNjZi1hMDE5LTU4MTBiZDEwZDg2Ni5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUxMTI1JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MTEyNVQyMDA4NDJaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT02MWQ5NWViZjE4NDEzOGYxM2ZhNWExNzJmNTEzMDcwZDkzNWQ4ZjhmZjkyNTMzNGE2MWExZWY3ZTgyOWEzN2QzJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.QGdAZdgKd-bTlgu2KphtiwQoiGKpSB_q-lRr88V--vg" width="35%">
</p>




---

> [!CAUTION]
> **LEIA ANTES DE COMEÇAR!**
> Para que o bot funcione, você **PRECISA** seguir o guia de configuração abaixo. Não altere o código-fonte (`.js`) se você não souber o que está fazendo. Todas as customizações necessárias são feitas nos arquivos de configuração.

## 📖 Sobre o Projeto

Este é um template completo de um bot de vendas para Discord, ideal para criadores de conteúdo e pequenos empreendedores que desejam vender produtos digitais (como e-books, presets, softwares, etc.) de forma semi-automatizada.

O grande diferencial deste bot é o **fluxo de pagamento com verificação manual**, que não exige integrações complexas com gateways de pagamento e é perfeito para quem recebe via PIX e precisa verificar os comprovantes um a um.

## ✨ Funcionalidades Principais

- **Painel de Vendas:** Um painel limpo e profissional no Discord para exibir seus produtos.
- **Lógica de Tiers:** Configure facilmente produtos com diferentes níveis de acesso (ex: um produto básico e um "premium" que dá acesso a um cargo especial).
- **Fluxo de Pagamento via DM:** O bot guia o usuário em uma conversa privada, fornecendo os dados para o pagamento.
- **Sistema de Verificação para Staff:** Os comprovantes enviados pelos usuários são centralizados em um canal privado, onde a equipe pode **Aprovar** ou **Recusar** a compra com um clique.
- **Entrega Automática:** Após a aprovação, o bot entrega o produto e/ou o cargo automaticamente para o cliente.
- **Fácil de Configurar:** Todo o projeto é pensado para ser customizado através de arquivos de configuração simples, sem a necessidade de alterar a lógica principal.

---

## 🚀 Quick Start: Testando o Bot em 5 Minutos

Siga estes passos para ver o bot funcionando rapidamente.

1.  **Renomeie `.env.example` para `.env`** e preencha **TODAS** as variáveis com suas informações (Token do bot, IDs de canais, chave PIX, etc.).
2.  **Abra `confirmacao.js`** e preencha os IDs do seu servidor e dos cargos (`ID_SERVIDOR`, `ID_CARGO_NORMAL`, `ID_CARGO_ESPECIAL`).
3.  **Abra `produtos.js`** e configure pelo menos um produto de teste.
4.  No terminal, rode `npm install` para instalar as dependências.
5.  Inicie o bot com `node index.js`.

Se tudo foi configurado corretamente, o bot ficará online e enviará o painel de vendas no canal que você definiu em `ID_CANAL_VENDAS`.

---

## ⚙️ Guia de Configuração Detalhado

### 1. Arquivo `.env` (Configurações Globais)
Este é o arquivo mais importante. Preencha cada variável:

- `TOKEN`: O token secreto do seu bot.
- `ID_CANAL_VENDAS`: ID do canal onde o painel de vendas será exibido.
- `PIX_CHAVE`, `PIX_NOME`, `PIX_CIDADE`: Seus dados do PIX.
- `URL_IMAGEM_PAINEL_VENDAS`: Link da imagem que aparece no topo do painel de vendas.
- `URL_IMAGEM_PAGAMENTO_PIX`: Link da imagem (logo da sua loja, por exemplo) que aparece na mensagem de pagamento.

### 2. Arquivo `produtos.js` (Seu Catálogo)
Aqui você define o que vai vender.

- `id`: Um nome único para o produto (ex: `'ebook_javascript'`). **Este ID precisa ser o mesmo** que você vai usar no arquivo `confirmacao.js`.
- `nome`: O nome bonito do produto que o cliente verá.
- `preco`: O preço em número (ex: `29.90`).

### 3. Arquivo `confirmacao.js` (Cargos e Entrega)
Aqui você define o que acontece **depois** que uma compra é aprovada.

- **Constantes no Topo:**
  - `ID_CANAL_CONFIRMACAO`: ID do canal **privado** onde a staff verá os comprovantes.
  - `ID_SERVIDOR`: ID do seu servidor.
  - `ID_CARGO_NORMAL`: Cargo para o produto básico. O cliente recebe apenas este cargo.
  - `ID_CARGO_ESPECIAL`: Cargo para o produto premium. **Dica:** Configure este cargo no seu Discord para dar acesso a um canal exclusivo de atualizações ou suporte.

- **Função `obterDetalhesDoProduto`:**
  - É aqui que a mágica da entrega acontece. Para cada `case`, você define o que será enviado ao cliente.
  - `case 'produto_basico'`: Corresponde ao produto com `id: 'produto_basico'` no `produtos.js`.
  - `linksTexto`: Altere o texto e os links de download para o seu produto.
  - `cargoParaDar`: Define qual cargo (`ID_CARGO_NORMAL` ou `ID_CARGO_ESPECIAL`) será dado.

---

## 🔄 Como Funciona o Fluxo de Venda?

1.  **Seleção:** O cliente seleciona um produto no painel de vendas.
2.  **Pagamento:** O bot envia uma DM para o cliente com os dados do PIX.
3.  **Comprovante:** O cliente envia a imagem do comprovante na mesma DM.
4.  **Análise:** O bot posta o comprovante e os dados do cliente no canal privado da staff, com os botões "Aprovar" e "Recusar".
5.  **Decisão:** Um staff clica em um dos botões.
6.  **Entrega:**
    - Se **aprovado**, o bot envia o produto e o cargo para o cliente.
    - Se **recusado**, o bot informa ao cliente que a compra não foi aprovada.


IMPORTANTE
## Processo de desenvolvimento
Este projeto foi desenvolvido por mim com apoio de ferramentas de IA para pesquisa, revisão de código e aceleração do aprendizado. Todo o código foi estudado, testado e compreendido.

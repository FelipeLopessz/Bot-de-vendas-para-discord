import {
  Client,
  GatewayIntentBits,
  Partials,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Events,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder
} from 'discord.js';
import { config } from 'dotenv';
import { listaDeProdutos } from './produtos.js';
import { setupConfirmacao } from './confirmacao.js';

// Carrega as variáveis de ambiente do arquivo .env
config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ],
  partials: [Partials.Channel, Partials.Message, Partials.User]
});

// Mapa para guardar compras pendentes (associa o ID do usuário ao produto que ele quer comprar)
const comprasPendentes = new Map();

// Inicia a lógica de confirmação de pagamentos
setupConfirmacao(client, comprasPendentes);

// Evento que roda quando o bot fica online
client.once(Events.ClientReady, async () => {
  console.log(`✅ Bot logado como ${client.user.tag}`);

  try {
    const channel = await client.channels.fetch(process.env.ID_CANAL_VENDAS);
    if (!channel) {
      console.error('❌ ERRO CRÍTICO: O canal de vendas definido em ID_CANAL_VENDAS não foi encontrado!');
      return;
    }

    // --- CRIAÇÃO DO PAINEL DE VENDAS ---
    const embedVendas = new EmbedBuilder()
      .setTitle('🛍️ Produtos da Nossa Loja')
      .setDescription('Selecione um produto abaixo para iniciar sua compra.')
      .setColor('Green')
      // A imagem agora é carregada a partir da configuração no arquivo .env
      .setImage(process.env.URL_IMAGEM_PAINEL_VENDAS);

    const menuDeProdutos = new StringSelectMenuBuilder()
      .setCustomId('selecionar_produto')
      .setPlaceholder('Clique aqui para ver os produtos disponíveis')
      .addOptions(
        // Mapeia a lista de produtos do arquivo produtos.js para as opções do menu
        listaDeProdutos.map(produto =>
          new StringSelectMenuOptionBuilder()
            .setLabel(produto.nome)
            .setDescription(`Preço: R$ ${produto.preco.toFixed(2)}`)
            .setValue(produto.id) // O valor agora é o ID do produto
        )
      );

    const painelDeAcao = new ActionRowBuilder().addComponents(menuDeProdutos);

    // Envia o painel de vendas para o canal configurado
    await channel.send({ embeds: [embedVendas], components: [painelDeAcao] });
    console.log('✅ Painel de vendas enviado com sucesso!');

  } catch (error) {
    console.error('❌ Erro ao enviar o painel de vendas:', error);
  }
});

// Evento que lida com todas as interações (cliques em botões, seleções em menus)
client.on(Events.InteractionCreate, async interaction => {
  if (interaction.isStringSelectMenu() && interaction.customId === 'selecionar_produto') {
    const produtoId = interaction.values[0];
    const produtoSelecionado = listaDeProdutos.find(p => p.id === produtoId);

    if (!produtoSelecionado) {
      return interaction.reply({ content: '❌ Este produto não foi encontrado.', ephemeral: true });
    }

    // Guarda a intenção de compra do usuário
    comprasPendentes.set(interaction.user.id, produtoSelecionado.id);

    // --- LÓGICA DE PAGAMENTO ---
    try {
      const embedPagamento = new EmbedBuilder()
        .setTitle(`💵 Pagamento para: ${produtoSelecionado.nome}`)
        .setDescription(`**Valor a pagar: R$ ${produtoSelecionado.preco.toFixed(2)}**`)
        .setColor('Yellow')
        .addFields(
          { name: 'Chave PIX (Copia e Cola)', value: `\`\`\`${process.env.PIX_CHAVE}\`\`\`` },
          { name: 'Beneficiário', value: process.env.PIX_NOME },
          { name: 'Cidade', value: process.env.PIX_CIDADE }
        )
        // A imagem de pagamento agora também vem do .env
        .setImage(process.env.URL_IMAGEM_PAGAMENTO_PIX)
        .setFooter({ text: 'Após o pagamento, envie o comprovante NESTA CONVERSA.' });

      // Envia a mensagem de pagamento na DM do usuário
      await interaction.user.send({
        content: 'Olá! Para concluir sua compra, faça o pagamento usando os dados abaixo.',
        embeds: [embedPagamento],
      });

      // Responde à interação original informando que as instruções foram enviadas
      await interaction.reply({
        content: '✅ Verifique sua Mensagem Direta (DM)! Enviei as instruções de pagamento para você.',
        ephemeral: true
      });

    } catch (error) {
      console.error('❌ Erro ao enviar DM de pagamento:', error);
      await interaction.reply({
        content: '❌ Não consegui enviar as instruções na sua DM. Por favor, verifique se suas mensagens diretas estão abertas para membros deste servidor.',
        ephemeral: true
      });
    }
  }
});

client.login(process.env.TOKEN);

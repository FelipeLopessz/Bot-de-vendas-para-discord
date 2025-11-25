import {
  Events,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} from 'discord.js';

// ================================================================================= //
// ======================= ÁREA DE CONFIGURAÇÃO OBRIGATÓRIA ======================== //
// ================================================================================= //
//                                                                                   //
//       O usuário que for configurar o bot PRECISA alterar os valores abaixo.       //
//                                                                                   //
// ================================================================================= //

/**
 * @const {string} ID_CANAL_CONFIRMACAO
 * @description ID do canal PRIVADO onde a staff irá receber os comprovantes para aprovar ou recusar.
 * Exemplo: '123456789012345678'
 */
const ID_CANAL_CONFIRMACAO = 'COLOQUE_O_ID_DO_CANAL_DE_ADMINS_AQUI';

/**
 * @const {string} ID_SERVIDOR
 * @description ID do seu servidor Discord.
 * Exemplo: '123456789012345678'
 */
const ID_SERVIDOR = 'COLOQUE_O_ID_DO_SEU_SERVIDOR_AQUI';

/**
 * @const {string} ID_CARGO_NORMAL
 * @description ID do cargo que o usuário recebe ao comprar o produto básico.
 * Pode ser um cargo de "Cliente", por exemplo.
 * Exemplo: '123456789012345678'
 */
const ID_CARGO_NORMAL = 'COLOQUE_O_ID_DO_CARGO_DE_CLIENTE_NORMAL_AQUI';

/**
 * @const {string} ID_CARGO_ESPECIAL
 * @description ID do cargo que o usuário recebe ao comprar o produto "premium" (com atualizações).
 * Exemplo: '123456789012345678'
 */
const ID_CARGO_ESPECIAL = 'COLOQUE_O_ID_DO_CARGO_DE_CLIENTE_PREMIUM_AQUI';


// ================================================================================= //
// ======================= LÓGICA DE ENTREGA DOS PRODUTOS ========================== //
// ================================================================================= //
//                                                                                   //
//    Esta seção define O QUE será entregue para cada produto após a confirmação.    //
//                                                                                   //
// ================================================================================= //

/**
 * Retorna os detalhes de entrega para um produto específico.
 * @param {string} nomeDoProduto - O nome do produto vindo do arquivo `produtos.js`.
 * @returns {{cargoParaDar: string, linksTexto: string, mensagemExtra: string}}
 */
function obterDetalhesDoProduto(nomeDoProduto) {
  // ATENÇÃO: O 'nomeDoProduto' aqui deve ser EXATAMENTE o mesmo 'id' que você definiu no arquivo `produtos.js`.
  switch (nomeDoProduto) {
    
    // --- PRODUTO 1: BÁSICO ---
    case 'produto_basico': // Este 'id' deve corresponder ao 'id' em produtos.js
      return {
        cargoParaDar: ID_CARGO_NORMAL,
        linksTexto: `
### Obrigado por sua compra!

Aqui estão os links para download do seu produto:

**Link para o Arquivo Principal:**
> [COLOQUE_O_LINK_DE_DOWNLOAD_DO_SEU_PRODUTO_AQUI]

**Link para o Arquivo Secundário (se houver):**
> [COLOQUE_OUTRO_LINK_AQUI]
        `,
        mensagemExtra: '\n\n📺 **Tutorial de Instalação:** [Assista ao vídeo](https://www.youtube.com/watch?v=seu-video-tutorial )'
      };

    // --- PRODUTO 2: PREMIUM ---
    case 'produto_premium': // Este 'id' deve corresponder ao 'id' em produtos.js
      return {
        cargoParaDar: ID_CARGO_ESPECIAL,
        linksTexto: `
### Obrigado por sua compra da versão Premium!

Você recebeu o cargo de acesso às atualizações. Aqui estão os links para download do seu produto:

**Link para o Arquivo Principal:**
> [COLOQUE_O_LINK_DE_DOWNLOAD_DO_SEU_PRODUTO_AQUI]

**Link para o Arquivo Secundário (se houver):**
> [COLOQUE_OUTRO_LINK_AQUI]
        `,
        mensagemExtra: '\n\n📺 **Tutorial de Instalação:** [Assista ao vídeo](https://www.youtube.com/watch?v=seu-video-tutorial-premium )'
      };

    // Caso padrão, se nenhum produto corresponder
    default:
      return {
        cargoParaDar: '',
        linksTexto: 'Produto não encontrado. Por favor, contate o suporte.',
        mensagemExtra: ''
      };
  }
}


// ================================================================================= //
// ============================ LÓGICA INTERNA DO BOT ============================== //
// ================================================================================= //
//                                                                                   //
//         A partir daqui, não é necessário fazer alterações para o bot rodar.       //
//                                                                                   //
// ================================================================================= //

export function setupConfirmacao(client, comprasPendentes) {
  // 1. Receber comprovantes enviados na DM do bot
  client.on(Events.MessageCreate, async message => {
    if (message.author.bot || message.channel.type !== 1) return; // Ignora bots e mensagens fora da DM

    try {
      const guild = await client.guilds.fetch(ID_SERVIDOR);
      const canalConfirmacao = await client.channels.fetch(ID_CANAL_CONFIRMACAO);

      const embed = new EmbedBuilder()
        .setTitle('✨ Novo Comprovante Recebido')
        .setDescription(`**Usuário:** ${message.author.tag}\n**ID:** \`${message.author.id}\``)
        .setColor('Blue')
        .setTimestamp();

      if (message.content) {
        embed.addFields({ name: 'Mensagem Adicional:', value: message.content.substring(0, 1024) });
      }

      if (message.attachments.size > 0) {
        const attachment = message.attachments.first();
        embed.setImage(attachment.url);
      } else {
        embed.addFields({ name: 'Aviso:', value: 'O usuário não enviou uma imagem anexa.' });
      }

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`confirmar_${message.author.id}`).setLabel('✅ Aprovar').setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId(`recusar_${message.author.id}`).setLabel('❌ Recusar').setStyle(ButtonStyle.Danger)
      );

      await canalConfirmacao.send({ embeds: [embed], components: [row] });
      await message.reply('✅ Recebemos seu comprovante! Nossa equipe vai analisar e te responder em breve.');

    } catch (error) {
      console.error('Erro ao processar comprovante na DM:', error);
      await message.reply('❌ Ocorreu um erro ao processar seu comprovante. Por favor, contate o suporte ou tente novamente.');
    }
  });

  // 2. Processar cliques nos botões "Aprovar" / "Recusar"
  client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isButton()) return;

    const [acao, userId] = interaction.customId.split('_');
    if (!['confirmar', 'recusar'].includes(acao)) return;

    if (!interaction.member.permissions.has('ManageRoles')) {
      return interaction.reply({ content: '❌ Você não tem permissão para executar esta ação.', ephemeral: true });
    }

    await interaction.deferUpdate(); // Confirma o clique para o Discord e evita que a interação "falhe"

    try {
      const guild = await client.guilds.fetch(ID_SERVIDOR);
      const membro = await guild.members.fetch(userId);
      const usuario = await client.users.fetch(userId);

      if (acao === 'confirmar') {
        const nomeDoProduto = comprasPendentes.get(userId);

        if (!nomeDoProduto) {
          return interaction.editReply({ content: '⚠️ **Aviso:** Não encontrei uma compra pendente para este usuário. A ação pode já ter sido processada ou o bot reiniciou.', components: [], embeds: [] });
        }

        const { cargoParaDar, linksTexto, mensagemExtra } = obterDetalhesDoProduto(nomeDoProduto);

        if (cargoParaDar) {
          await membro.roles.add(cargoParaDar);
        }

        await usuario.send({
          content: `🎉 **Sua compra foi confirmada!** 🎉\n\nVocê comprou: **${nomeDoProduto}**\n${linksTexto}${mensagemExtra}`
        });

        comprasPendentes.delete(userId);
        return interaction.editReply({ content: `✅ Compra de **${usuario.username}** confirmada com sucesso.`, components: [], embeds: [] });

      } else if (acao === 'recusar') {
        await usuario.send('❌ Sua compra não foi aprovada. Verifique se o comprovante está correto e, se necessário, contate o suporte. Você pode tentar novamente enviando um novo comprovante.');
        comprasPendentes.delete(userId);
        return interaction.editReply({ content: `❌ Compra de **${usuario.username}** foi recusada.`, components: [], embeds: [] });
      }

    } catch (error) {
      console.error('Erro ao processar confirmação/recusa:', error);
      return interaction.editReply({ content: '❌ Ocorreu um erro grave ao processar a ação. Verifique o console.', components: [], embeds: [] });
    }
  });
}

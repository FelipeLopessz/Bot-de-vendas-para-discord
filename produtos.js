// ================================================================================= //
// ======================= CATÁLOGO DE PRODUTOS DA SUA LOJA ======================== //
// ================================================================================= //
//                                                                                   //
//         Adicione, remova ou edite os produtos da sua loja neste arquivo.          //
//                                                                                   //
// ================================================================================= //

export const listaDeProdutos = [

  // --- MODELO DE PRODUTO 1: PRODUTO BÁSICO ---
  // Siga este modelo para criar seus produtos. Você pode copiar e colar este bloco
  // para adicionar mais produtos à sua loja.
  {
    /**
     * @property {string} id - Um identificador ÚNICO para o produto.
     * IMPORTANTE: Este 'id' deve ser o mesmo usado no arquivo `confirmacao.js`.
     * Use apenas letras minúsculas e underscores (_). Ex: 'meu_produto_1'.
     */
    id: 'produto_basico',

    /**
     * @property {string} nome - O nome do produto que aparecerá para o cliente no menu.
     * Ex: 'E-book de Programação'.
     */
    nome: 'Licença Básica do Produto X',

    /**
     * @property {number} preco - O preço do produto. Use apenas números.
     * O formato de moeda (R$) será adicionado automaticamente.
     * Ex: 10.00 (para R$ 10,00).
     */
    preco: 10.00,
  },


  // --- MODELO DE PRODUTO 2: PRODUTO PREMIUM ---
  {
    id: 'produto_premium',
    nome: 'Licença Premium do Produto X (com Atualizações)',
    preco: 20.00,
  },
  
  // Adicione mais produtos aqui seguindo o mesmo formato.

];
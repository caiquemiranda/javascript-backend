/**
 * Script principal para a interface do gerenciador de produtos
 */
document.addEventListener('DOMContentLoaded', () => {
    // Elementos do DOM
    const produtoForm = document.getElementById('produto-form');
    const produtoId = document.getElementById('produto-id');
    const produtoNome = document.getElementById('nome');
    const produtoDescricao = document.getElementById('descricao');
    const produtoPreco = document.getElementById('preco');
    const produtoEstoque = document.getElementById('estoque');
    const produtoCategoria = document.getElementById('categoria');
    const btnCancelar = document.getElementById('btn-cancelar');
    const produtosLista = document.getElementById('produtos-lista');
    const searchInput = document.getElementById('search');
    const btnSearch = document.getElementById('btn-search');
    const toast = document.getElementById('toast');

    // URL base da API
    const API_URL = '/api/produtos';

    // Estado da aplicação
    let editando = false;
    let produtos = [];

    // Inicialização
    carregarProdutos();

    // Event Listeners
    produtoForm.addEventListener('submit', handleFormSubmit);
    btnCancelar.addEventListener('click', limparFormulario);
    btnSearch.addEventListener('click', buscarProdutos);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            buscarProdutos();
        }
    });

    /**
     * Carrega todos os produtos da API
     */
    async function carregarProdutos() {
        try {
            produtosLista.innerHTML = '<p class="loading">Carregando produtos...</p>';

            const response = await fetch(API_URL);
            const data = await response.json();

            if (response.ok) {
                produtos = data.data || [];
                renderizarProdutos(produtos);
            } else {
                mostrarErro('Erro ao carregar produtos: ' + data.message);
                produtosLista.innerHTML = '<p class="empty-message">Erro ao carregar produtos.</p>';
            }
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            mostrarErro('Erro ao carregar produtos. Verifique o console para mais detalhes.');
            produtosLista.innerHTML = '<p class="empty-message">Erro ao carregar produtos.</p>';
        }
    }

    /**
     * Busca produtos por termo
     */
    async function buscarProdutos() {
        const termo = searchInput.value.trim();

        if (!termo) {
            carregarProdutos();
            return;
        }

        try {
            produtosLista.innerHTML = '<p class="loading">Buscando produtos...</p>';

            const response = await fetch(`${API_URL}/busca?termo=${encodeURIComponent(termo)}`);
            const data = await response.json();

            if (response.ok) {
                produtos = data.data || [];
                renderizarProdutos(produtos, `Resultados para "${termo}"`);
            } else {
                mostrarErro('Erro na busca: ' + data.message);
                produtosLista.innerHTML = '<p class="empty-message">Erro ao buscar produtos.</p>';
            }
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            mostrarErro('Erro ao buscar produtos. Verifique o console para mais detalhes.');
            produtosLista.innerHTML = '<p class="empty-message">Erro ao buscar produtos.</p>';
        }
    }

    /**
     * Renderiza a lista de produtos
     * @param {Array} produtos Lista de produtos a renderizar
     * @param {string} mensagemVazia Mensagem a exibir se não houver produtos
     */
    function renderizarProdutos(produtos, mensagemVazia = 'Nenhum produto cadastrado.') {
        if (!produtos || produtos.length === 0) {
            produtosLista.innerHTML = `<p class="empty-message">${mensagemVazia}</p>`;
            return;
        }

        let html = '';

        produtos.forEach(produto => {
            html += `
                <div class="produto-item">
                    <div class="produto-info">
                        <h4>${produto.nome}</h4>
                        <p>${produto.descricao || 'Sem descrição'}</p>
                        <p>Categoria: ${produto.categoria || 'Não categorizado'}</p>
                        <p>Estoque: ${produto.estoque !== undefined ? produto.estoque : 'N/A'}</p>
                    </div>
                    <div class="produto-preco">
                        R$ ${produto.preco.toFixed(2)}
                    </div>
                    <div class="produto-acoes">
                        <button class="btn btn-edit" onclick="editarProduto(${produto.id})">Editar</button>
                        <button class="btn btn-danger" onclick="removerProduto(${produto.id})">Remover</button>
                    </div>
                </div>
            `;
        });

        produtosLista.innerHTML = html;
    }

    /**
     * Manipula o envio do formulário (criar ou atualizar produto)
     * @param {Event} e Evento de submit
     */
    async function handleFormSubmit(e) {
        e.preventDefault();

        const produto = {
            nome: produtoNome.value.trim(),
            descricao: produtoDescricao.value.trim(),
            preco: parseFloat(produtoPreco.value),
            estoque: produtoEstoque.value ? parseInt(produtoEstoque.value) : undefined,
            categoria: produtoCategoria.value.trim()
        };

        if (editando) {
            await atualizarProduto(parseInt(produtoId.value), produto);
        } else {
            await criarProduto(produto);
        }
    }

    /**
     * Cria um novo produto
     * @param {Object} produto Dados do produto a criar
     */
    async function criarProduto(produto) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(produto)
            });

            const data = await response.json();

            if (response.ok) {
                mostrarSucesso('Produto criado com sucesso!');
                limparFormulario();
                carregarProdutos();
            } else {
                mostrarErro(`Erro ao criar produto: ${data.message}`);
                console.error('Erros de validação:', data.erros);
            }
        } catch (error) {
            console.error('Erro ao criar produto:', error);
            mostrarErro('Erro ao criar produto. Verifique o console para mais detalhes.');
        }
    }

    /**
     * Atualiza um produto existente
     * @param {number} id ID do produto a atualizar
     * @param {Object} produto Dados atualizados do produto
     */
    async function atualizarProduto(id, produto) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(produto)
            });

            const data = await response.json();

            if (response.ok) {
                mostrarSucesso('Produto atualizado com sucesso!');
                limparFormulario();
                carregarProdutos();
            } else {
                mostrarErro(`Erro ao atualizar produto: ${data.message}`);
                console.error('Erros de validação:', data.erros);
            }
        } catch (error) {
            console.error('Erro ao atualizar produto:', error);
            mostrarErro('Erro ao atualizar produto. Verifique o console para mais detalhes.');
        }
    }

    /**
     * Prepara o formulário para edição de um produto
     * @param {number} id ID do produto a editar
     */
    window.editarProduto = async function (id) {
        try {
            const response = await fetch(`${API_URL}/${id}`);
            const data = await response.json();

            if (response.ok) {
                const produto = data.data;

                // Preenche o formulário
                produtoId.value = produto.id;
                produtoNome.value = produto.nome || '';
                produtoDescricao.value = produto.descricao || '';
                produtoPreco.value = produto.preco || '';
                produtoEstoque.value = produto.estoque !== undefined ? produto.estoque : '';
                produtoCategoria.value = produto.categoria || '';

                // Atualiza o estado
                editando = true;

                // Rola para o formulário
                produtoForm.scrollIntoView({ behavior: 'smooth' });
            } else {
                mostrarErro(`Erro ao carregar produto: ${data.message}`);
            }
        } catch (error) {
            console.error('Erro ao carregar produto para edição:', error);
            mostrarErro('Erro ao carregar produto. Verifique o console para mais detalhes.');
        }
    };

    /**
     * Remove um produto
     * @param {number} id ID do produto a remover
     */
    window.removerProduto = async function (id) {
        if (!confirm('Tem certeza que deseja remover este produto?')) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (response.ok) {
                mostrarSucesso('Produto removido com sucesso!');
                carregarProdutos();
            } else {
                mostrarErro(`Erro ao remover produto: ${data.message}`);
            }
        } catch (error) {
            console.error('Erro ao remover produto:', error);
            mostrarErro('Erro ao remover produto. Verifique o console para mais detalhes.');
        }
    };

    /**
     * Limpa o formulário e reseta o estado
     */
    function limparFormulario() {
        produtoForm.reset();
        produtoId.value = '';
        editando = false;
    }

    /**
     * Exibe uma mensagem de sucesso
     * @param {string} mensagem Mensagem a exibir
     */
    function mostrarSucesso(mensagem) {
        toast.textContent = mensagem;
        toast.className = 'toast show';

        setTimeout(() => {
            toast.className = 'toast';
        }, 3000);
    }

    /**
     * Exibe uma mensagem de erro
     * @param {string} mensagem Mensagem a exibir
     */
    function mostrarErro(mensagem) {
        toast.textContent = mensagem;
        toast.className = 'toast show error';

        setTimeout(() => {
            toast.className = 'toast';
        }, 3000);
    }
}); 
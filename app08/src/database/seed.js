/**
 * Script para popular o banco de dados com dados iniciais
 */
const db = require('../config/database');

// Função para executar cada seed
const runSeeds = async () => {
    console.log('Iniciando população do banco de dados...');

    // Categorias padrão
    const categorias = [
        { nome: 'Trabalho', descricao: 'Tarefas relacionadas ao trabalho' },
        { nome: 'Pessoal', descricao: 'Tarefas pessoais' },
        { nome: 'Estudos', descricao: 'Tarefas relacionadas aos estudos' },
        { nome: 'Compras', descricao: 'Lista de compras e itens para adquirir' },
        { nome: 'Projetos', descricao: 'Tarefas de projetos pessoais' }
    ];

    // Etiquetas padrão
    const etiquetas = [
        { nome: 'Urgente', cor: '#e74c3c' },
        { nome: 'Importante', cor: '#f39c12' },
        { nome: 'Em Progresso', cor: '#3498db' },
        { nome: 'Adiado', cor: '#95a5a6' },
        { nome: 'Fácil', cor: '#2ecc71' }
    ];

    // Tarefas iniciais
    const tarefas = [
        { 
            titulo: 'Criar apresentação para reunião', 
            descricao: 'Preparar slides para a reunião de equipe na segunda-feira',
            concluida: 0,
            data_vencimento: '2023-07-10',
            prioridade: 2,
            categoria_id: 1
        },
        { 
            titulo: 'Comprar mantimentos', 
            descricao: 'Leite, ovos, pão, frutas',
            concluida: 0,
            data_vencimento: '2023-07-05',
            prioridade: 1,
            categoria_id: 4
        },
        { 
            titulo: 'Estudar para a prova de JavaScript', 
            descricao: 'Revisar capítulos 5 a 8 do livro',
            concluida: 0,
            data_vencimento: '2023-07-15',
            prioridade: 3,
            categoria_id: 3
        },
        { 
            titulo: 'Marcar consulta médica', 
            descricao: 'Agendar check-up anual',
            concluida: 0,
            data_vencimento: '2023-07-20',
            prioridade: 2,
            categoria_id: 2
        },
        { 
            titulo: 'Enviar relatório mensal', 
            descricao: 'Compilar dados e enviar para o gerente',
            concluida: 1,
            data_vencimento: '2023-07-01',
            prioridade: 2,
            categoria_id: 1
        }
    ];

    // Relações entre tarefas e etiquetas
    const tarefaEtiquetas = [
        { tarefa_id: 1, etiqueta_id: 2 }, // Criar apresentação -> Importante
        { tarefa_id: 1, etiqueta_id: 3 }, // Criar apresentação -> Em Progresso
        { tarefa_id: 2, etiqueta_id: 5 }, // Comprar mantimentos -> Fácil
        { tarefa_id: 3, etiqueta_id: 1 }, // Estudar -> Urgente
        { tarefa_id: 3, etiqueta_id: 2 }, // Estudar -> Importante
        { tarefa_id: 4, etiqueta_id: 4 }, // Marcar consulta -> Adiado
        { tarefa_id: 5, etiqueta_id: 2 }  // Enviar relatório -> Importante
    ];

    // Função para inserir dados em uma tabela
    const inserirDados = (tabela, dados) => {
        return new Promise((resolve, reject) => {
            // Limpa a tabela antes de inserir novos dados
            db.run(`DELETE FROM ${tabela}`, (err) => {
                if (err) {
                    console.error(`Erro ao limpar a tabela ${tabela}:`, err.message);
                    reject(err);
                    return;
                }

                // Reseta o autoincrement
                db.run(`DELETE FROM sqlite_sequence WHERE name='${tabela}'`, (err) => {
                    if (err) {
                        console.warn(`Aviso: Não foi possível resetar o autoincrement para ${tabela}:`, err.message);
                        // Continua mesmo com este erro
                    }

                    // Contagem de inserções bem-sucedidas
                    let contadorSucesso = 0;

                    // Se não houver dados para inserir, resolve imediatamente
                    if (dados.length === 0) {
                        resolve(0);
                        return;
                    }

                    // Para cada item, executa a inserção
                    dados.forEach((item, index) => {
                        // Cria as partes da query SQL
                        const colunas = Object.keys(item).join(', ');
                        const placeholders = Object.keys(item).map(() => '?').join(', ');
                        const valores = Object.values(item);

                        // Monta a query final
                        const query = `INSERT INTO ${tabela} (${colunas}) VALUES (${placeholders})`;

                        // Executa a inserção
                        db.run(query, valores, function(err) {
                            if (err) {
                                console.error(`Erro ao inserir em ${tabela}:`, err.message);
                                console.error('Query:', query);
                                console.error('Valores:', valores);
                            } else {
                                contadorSucesso++;
                                console.log(`Inserido em ${tabela} com ID ${this.lastID}`);
                            }

                            // Se foi o último item, resolve a promise
                            if (index === dados.length - 1) {
                                resolve(contadorSucesso);
                            }
                        });
                    });
                });
            });
        });
    };

    try {
        // Executa os seeds em ordem
        console.log('Inserindo categorias...');
        const categoriasInseridas = await inserirDados('categorias', categorias);
        console.log(`${categoriasInseridas} categorias inseridas com sucesso.`);

        console.log('Inserindo etiquetas...');
        const etiquetasInseridas = await inserirDados('etiquetas', etiquetas);
        console.log(`${etiquetasInseridas} etiquetas inseridas com sucesso.`);

        console.log('Inserindo tarefas...');
        const tarefasInseridas = await inserirDados('tarefas', tarefas);
        console.log(`${tarefasInseridas} tarefas inseridas com sucesso.`);

        console.log('Inserindo relações entre tarefas e etiquetas...');
        const relacoesInseridas = await inserirDados('tarefa_etiquetas', tarefaEtiquetas);
        console.log(`${relacoesInseridas} relações inseridas com sucesso.`);

        console.log('População do banco de dados concluída com sucesso!');
    } catch (error) {
        console.error('Erro ao popular o banco de dados:', error.message);
    } finally {
        // Fecha a conexão com o banco de dados
        db.close();
    }
};

// Executa os seeds
runSeeds(); 
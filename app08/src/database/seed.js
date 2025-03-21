const db = require('./connection');

/**
 * Script para popular o banco de dados com dados iniciais
 */
const seed = async () => {
    try {
        console.log('Iniciando seed do banco de dados...');

        // Iniciar transação
        await db.beginTransaction();

        // Inserir categorias
        const categories = [
            {
                name: 'Trabalho',
                description: 'Tarefas relacionadas ao trabalho e projetos profissionais'
            },
            {
                name: 'Pessoal',
                description: 'Tarefas pessoais e compromissos'
            },
            {
                name: 'Estudos',
                description: 'Tarefas relacionadas a estudos e aprendizado'
            },
            {
                name: 'Casa',
                description: 'Tarefas domésticas e manutenção da casa'
            },
            {
                name: 'Saúde',
                description: 'Tarefas relacionadas à saúde e bem-estar'
            }
        ];

        for (const category of categories) {
            await db.run(`
        INSERT INTO categories (name, description, created_at, updated_at)
        VALUES (?, ?, datetime('now'), datetime('now'))
      `, [category.name, category.description]);
        }
        console.log(`${categories.length} categorias inseridas com sucesso.`);

        // Inserir etiquetas
        const labels = [
            { name: 'Urgente', color: '#FF0000' },
            { name: 'Importante', color: '#FFA500' },
            { name: 'Fácil', color: '#00FF00' },
            { name: 'Difícil', color: '#800080' },
            { name: 'Rápido', color: '#0000FF' },
            { name: 'Longo prazo', color: '#808080' }
        ];

        for (const label of labels) {
            await db.run(`
        INSERT INTO labels (name, color, created_at, updated_at)
        VALUES (?, ?, datetime('now'), datetime('now'))
      `, [label.name, label.color]);
        }
        console.log(`${labels.length} etiquetas inseridas com sucesso.`);

        // Buscar IDs das categorias e etiquetas inseridas
        const categoryIds = await db.all('SELECT id, name FROM categories');
        const labelIds = await db.all('SELECT id, name FROM labels');

        // Mapear IDs por nome para facilitar o acesso
        const categoryMap = {};
        categoryIds.forEach(cat => {
            categoryMap[cat.name] = cat.id;
        });

        const labelMap = {};
        labelIds.forEach(label => {
            labelMap[label.name] = label.id;
        });

        // Inserir tarefas
        const tasks = [
            {
                title: 'Preparar apresentação para reunião',
                description: 'Criar slides e preparar material para a reunião de equipe',
                due_date: '2023-12-15',
                priority: 'alta',
                status: 'pendente',
                category_id: categoryMap['Trabalho'],
                labels: [labelMap['Importante'], labelMap['Urgente']]
            },
            {
                title: 'Estudar para certificação',
                description: 'Revisar material e fazer exercícios práticos',
                due_date: '2023-12-20',
                priority: 'média',
                status: 'em andamento',
                category_id: categoryMap['Estudos'],
                labels: [labelMap['Importante'], labelMap['Difícil']]
            },
            {
                title: 'Fazer compras no supermercado',
                description: 'Comprar itens essenciais para a semana',
                due_date: '2023-12-10',
                priority: 'baixa',
                status: 'pendente',
                category_id: categoryMap['Casa'],
                labels: [labelMap['Rápido']]
            },
            {
                title: 'Agendar consulta médica',
                description: 'Marcar check-up anual',
                due_date: '2023-12-30',
                priority: 'média',
                status: 'pendente',
                category_id: categoryMap['Saúde'],
                labels: [labelMap['Importante']]
            },
            {
                title: 'Organizar documentos pessoais',
                description: 'Separar e arquivar documentos importantes',
                due_date: '2023-12-25',
                priority: 'baixa',
                status: 'pendente',
                category_id: categoryMap['Pessoal'],
                labels: [labelMap['Fácil']]
            },
            {
                title: 'Implementar nova funcionalidade',
                description: 'Desenvolver e testar nova feature do sistema',
                due_date: '2023-12-18',
                priority: 'alta',
                status: 'em andamento',
                category_id: categoryMap['Trabalho'],
                labels: [labelMap['Difícil'], labelMap['Importante']]
            },
            {
                title: 'Ler livro recomendado',
                description: 'Terminar de ler o livro indicado pelo mentor',
                due_date: '2024-01-10',
                priority: 'baixa',
                status: 'em andamento',
                category_id: categoryMap['Estudos'],
                labels: [labelMap['Longo prazo']]
            },
            {
                title: 'Limpar o escritório',
                description: 'Organizar papéis e limpar a mesa de trabalho',
                due_date: '2023-12-12',
                priority: 'média',
                status: 'pendente',
                category_id: categoryMap['Casa'],
                labels: [labelMap['Fácil'], labelMap['Rápido']]
            }
        ];

        // Inserir tarefas e suas etiquetas
        for (const task of tasks) {
            const { labels, ...taskData } = task;

            // Inserir tarefa
            const result = await db.run(`
        INSERT INTO tasks (title, description, due_date, priority, status, category_id, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      `, [
                taskData.title,
                taskData.description,
                taskData.due_date,
                taskData.priority,
                taskData.status,
                taskData.category_id
            ]);

            const taskId = result.lastID;

            // Inserir relações com etiquetas
            if (labels && labels.length > 0) {
                for (const labelId of labels) {
                    await db.run(`
            INSERT INTO task_labels (task_id, label_id)
            VALUES (?, ?)
          `, [taskId, labelId]);
                }
            }
        }
        console.log(`${tasks.length} tarefas inseridas com sucesso.`);

        // Confirmar transação
        await db.commit();

        console.log('Seed concluído com sucesso!');
    } catch (error) {
        // Reverter transação em caso de erro
        await db.rollback();
        console.error('Erro durante o seed:', error.message);
        throw error;
    } finally {
        // Fechar conexão com o banco de dados
        await db.close();
    }
};

// Executar seed
seed().catch(error => {
    console.error('Falha no seed:', error);
    process.exit(1);
});

// Elementos do DOM
const tarefaForm = document.getElementById('tarefa-form');
const descricaoInput = document.getElementById('descricao');
const listaTarefas = document.getElementById('lista-tarefas');
const filtrarTodas = document.getElementById('filtrar-todas');
const filtrarAtivas = document.getElementById('filtrar-ativas');
const filtrarConcluidas = document.getElementById('filtrar-concluidas');

// Estado da aplicação
let tarefas = [];
let filtroAtual = 'todas';

// Carregar tarefas do servidor ao iniciar
document.addEventListener('DOMContentLoaded', () => {
    carregarTarefas();
});

// Event listeners para os botões de filtro
filtrarTodas.addEventListener('click', () => aplicarFiltro('todas'));
filtrarAtivas.addEventListener('click', () => aplicarFiltro('ativas'));
filtrarConcluidas.addEventListener('click', () => aplicarFiltro('concluidas'));

// Event listener para o formulário de nova tarefa
tarefaForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const descricao = descricaoInput.value.trim();
    if (!descricao) return;

    adicionarTarefa(descricao);
    descricaoInput.value = '';
});

// Funções para interação com a API

// Carregar todas as tarefas
async function carregarTarefas() {
    try {
        const response = await fetch('/api/tarefas');
        tarefas = await response.json();

        renderizarTarefas();
    } catch (erro) {
        console.error('Erro ao carregar tarefas:', erro);
        listaTarefas.innerHTML = '<li class="erro">Erro ao carregar tarefas. Tente novamente mais tarde.</li>';
    }
}

// Adicionar nova tarefa
async function adicionarTarefa(descricao) {
    try {
        const response = await fetch('/api/tarefas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ descricao })
        });

        const novaTarefa = await response.json();
        tarefas.push(novaTarefa);

        renderizarTarefas();
    } catch (erro) {
        console.error('Erro ao adicionar tarefa:', erro);
        alert('Erro ao adicionar tarefa. Tente novamente.');
    }
}

// Marcar tarefa como concluída/não concluída
async function alterarStatusTarefa(id, concluida) {
    try {
        const response = await fetch(`/api/tarefas/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ concluida })
        });

        const tarefaAtualizada = await response.json();

        // Atualizar a tarefa na lista local
        const index = tarefas.findIndex(t => t.id === id);
        if (index !== -1) {
            tarefas[index] = tarefaAtualizada;
            renderizarTarefas();
        }
    } catch (erro) {
        console.error('Erro ao atualizar tarefa:', erro);
        alert('Erro ao atualizar tarefa. Tente novamente.');
    }
}

// Excluir uma tarefa
async function excluirTarefa(id) {
    try {
        await fetch(`/api/tarefas/${id}`, {
            method: 'DELETE'
        });

        // Remover a tarefa da lista local
        tarefas = tarefas.filter(t => t.id !== id);
        renderizarTarefas();
    } catch (erro) {
        console.error('Erro ao excluir tarefa:', erro);
        alert('Erro ao excluir tarefa. Tente novamente.');
    }
}

// Funções de UI

// Aplicar filtro às tarefas
function aplicarFiltro(filtro) {
    filtroAtual = filtro;

    // Atualizar classes ativas
    filtrarTodas.classList.toggle('active', filtro === 'todas');
    filtrarAtivas.classList.toggle('active', filtro === 'ativas');
    filtrarConcluidas.classList.toggle('active', filtro === 'concluidas');

    renderizarTarefas();
}

// Renderizar a lista de tarefas com base no filtro atual
function renderizarTarefas() {
    // Aplicar filtro
    let tarefasFiltradas = tarefas;

    if (filtroAtual === 'ativas') {
        tarefasFiltradas = tarefas.filter(t => !t.concluida);
    } else if (filtroAtual === 'concluidas') {
        tarefasFiltradas = tarefas.filter(t => t.concluida);
    }

    // Limpar a lista
    listaTarefas.innerHTML = '';

    // Caso não haja tarefas para mostrar
    if (tarefasFiltradas.length === 0) {
        listaTarefas.innerHTML = '<li>Nenhuma tarefa encontrada.</li>';
        return;
    }

    // Renderizar as tarefas
    tarefasFiltradas.forEach(tarefa => {
        const li = document.createElement('li');

        const tarefaItem = document.createElement('div');
        tarefaItem.className = `tarefa-item ${tarefa.concluida ? 'tarefa-concluida' : ''}`;

        const tarefaTexto = document.createElement('span');
        tarefaTexto.className = 'tarefa-texto';
        tarefaTexto.textContent = tarefa.descricao;

        tarefaItem.appendChild(tarefaTexto);

        const acoesDiv = document.createElement('div');
        acoesDiv.className = 'tarefa-acoes';

        // Botão de concluir/desfazer
        const btnConcluir = document.createElement('button');
        btnConcluir.className = 'btn-concluir';
        btnConcluir.textContent = tarefa.concluida ? 'Desfazer' : 'Concluir';
        btnConcluir.addEventListener('click', () => alterarStatusTarefa(tarefa.id, !tarefa.concluida));

        // Botão de excluir
        const btnExcluir = document.createElement('button');
        btnExcluir.className = 'btn-excluir';
        btnExcluir.textContent = 'Excluir';
        btnExcluir.addEventListener('click', () => {
            if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
                excluirTarefa(tarefa.id);
            }
        });

        acoesDiv.appendChild(btnConcluir);
        acoesDiv.appendChild(btnExcluir);

        li.appendChild(tarefaItem);
        li.appendChild(acoesDiv);

        listaTarefas.appendChild(li);
    });
} 
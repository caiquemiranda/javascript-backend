import React from 'react';
import ItemTarefa from './ItemTarefa';

function ListaTarefas({ tarefas, alternarStatus, removerTarefa }) {
    if (tarefas.length === 0) {
        return (
            <div className="mensagem-vazia">
                <p>Nenhuma tarefa encontrada. Adicione uma nova tarefa!</p>
            </div>
        );
    }

    return (
        <ul className="lista-tarefas">
            {tarefas.map(tarefa => (
                <ItemTarefa
                    key={tarefa.id}
                    tarefa={tarefa}
                    alternarStatus={alternarStatus}
                    removerTarefa={removerTarefa}
                />
            ))}
        </ul>
    );
}

export default ListaTarefas; 
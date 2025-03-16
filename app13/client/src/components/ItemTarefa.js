import React from 'react';

function ItemTarefa({ tarefa, alternarStatus, removerTarefa }) {
  return (
    <li className="item-tarefa">
      <input
        type="checkbox"
        className="checkbox-tarefa"
        checked={tarefa.concluida}
        onChange={() => alternarStatus(tarefa.id)}
      />
      <span className={`tarefa-texto ${tarefa.concluida ? 'tarefa-concluida' : ''}`}>
        {tarefa.descricao}
      </span>
      <button
        className="btn-remover"
        onClick={() => removerTarefa(tarefa.id)}
        title="Remover tarefa"
      >
        <i className="fas fa-trash"></i>
      </button>
    </li>
  );
}

export default ItemTarefa; 
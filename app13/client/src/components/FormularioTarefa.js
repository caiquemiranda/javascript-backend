import React, { useState } from 'react';

function FormularioTarefa({ adicionarTarefa }) {
    const [descricao, setDescricao] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (descricao.trim()) {
            adicionarTarefa(descricao);
            setDescricao('');
        }
    };

    return (
        <form className="form-container" onSubmit={handleSubmit}>
            <input
                type="text"
                className="tarefa-input"
                placeholder="Digite uma nova tarefa..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
            />
            <button type="submit" className="btn-adicionar">
                Adicionar
            </button>
        </form>
    );
}

export default FormularioTarefa; 
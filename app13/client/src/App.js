import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FormularioTarefa from './components/FormularioTarefa';
import ListaTarefas from './components/ListaTarefas';

function App() {
    const [tarefas, setTarefas] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');

    // Carregar tarefas da API quando o componente montar
    useEffect(() => {
        buscarTarefas();
    }, []);

    // Função para buscar todas as tarefas da API
    const buscarTarefas = async () => {
        try {
            setCarregando(true);
            const resposta = await axios.get('/api/tarefas');
            setTarefas(resposta.data);
            setErro('');
        } catch (erro) {
            console.error('Erro ao buscar tarefas:', erro);
            setErro('Não foi possível carregar as tarefas. Tente novamente mais tarde.');
        } finally {
            setCarregando(false);
        }
    };

    // Adicionar uma nova tarefa
    const adicionarTarefa = async (descricao) => {
        try {
            const resposta = await axios.post('/api/tarefas', { descricao });
            setTarefas([...tarefas, resposta.data]);
        } catch (erro) {
            console.error('Erro ao adicionar tarefa:', erro);
            setErro('Não foi possível adicionar a tarefa.');
        }
    };

    // Alternar o status de uma tarefa (concluída/não concluída)
    const alternarStatus = async (id) => {
        try {
            const tarefa = tarefas.find(t => t.id === id);
            const resposta = await axios.put(`/api/tarefas/${id}`, {
                concluida: !tarefa.concluida
            });

            setTarefas(tarefas.map(t =>
                t.id === id ? resposta.data : t
            ));
        } catch (erro) {
            console.error('Erro ao atualizar tarefa:', erro);
            setErro('Não foi possível atualizar a tarefa.');
        }
    };

    // Remover uma tarefa
    const removerTarefa = async (id) => {
        try {
            await axios.delete(`/api/tarefas/${id}`);
            setTarefas(tarefas.filter(t => t.id !== id));
        } catch (erro) {
            console.error('Erro ao remover tarefa:', erro);
            setErro('Não foi possível remover a tarefa.');
        }
    };

    return (
        <div className="container">
            <header className="app-header">
                <h1 className="app-title">Lista de Tarefas</h1>
                <p>Gerencie suas tarefas com facilidade</p>
            </header>

            <FormularioTarefa adicionarTarefa={adicionarTarefa} />

            {erro && <p className="erro-mensagem">{erro}</p>}

            {carregando ? (
                <p className="carregando">Carregando tarefas...</p>
            ) : (
                <ListaTarefas
                    tarefas={tarefas}
                    alternarStatus={alternarStatus}
                    removerTarefa={removerTarefa}
                />
            )}
        </div>
    );
}

export default App; 
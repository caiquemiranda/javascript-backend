import React, { useState, useEffect } from 'react';
import FormularioCadastro from './components/FormularioCadastro';
import ListaCadastros from './components/ListaCadastros';
import axios from 'axios';
import { toast } from 'react-toastify';

function App() {
    const [cadastros, setCadastros] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [cadastroEmEdicao, setCadastroEmEdicao] = useState(null);

    // Carregar cadastros ao iniciar a aplicação
    useEffect(() => {
        buscarCadastros();
    }, []);

    // Buscar todos os cadastros da API
    const buscarCadastros = async () => {
        try {
            setCarregando(true);
            const resposta = await axios.get('/api/cadastros');
            setCadastros(resposta.data);
            setErro('');
        } catch (erro) {
            console.error('Erro ao buscar cadastros:', erro);
            setErro('Não foi possível carregar os cadastros. Tente novamente mais tarde.');
            toast.error('Erro ao carregar cadastros');
        } finally {
            setCarregando(false);
        }
    };

    // Adicionar novo cadastro
    const adicionarCadastro = async (dados) => {
        try {
            const resposta = await axios.post('/api/cadastros', dados);
            setCadastros([...cadastros, resposta.data]);
            toast.success('Cadastro realizado com sucesso!');
            return { sucesso: true };
        } catch (erro) {
            console.error('Erro ao adicionar cadastro:', erro);

            if (erro.response && erro.response.data && erro.response.data.erros) {
                return {
                    sucesso: false,
                    erros: erro.response.data.erros.reduce((acc, curr) => {
                        acc[curr.campo] = curr.mensagem;
                        return acc;
                    }, {})
                };
            }

            toast.error('Erro ao adicionar cadastro');
            return { sucesso: false, erros: { geral: 'Erro ao processar solicitação' } };
        }
    };

    // Remover cadastro
    const removerCadastro = async (id) => {
        try {
            await axios.delete(`/api/cadastros/${id}`);
            setCadastros(cadastros.filter(c => c.id !== id));
            toast.success('Cadastro removido com sucesso!');
        } catch (erro) {
            console.error('Erro ao remover cadastro:', erro);
            toast.error('Erro ao remover cadastro');
        }
    };

    // Iniciar edição de cadastro
    const iniciarEdicao = (cadastro) => {
        setCadastroEmEdicao(cadastro);
    };

    // Cancelar edição
    const cancelarEdicao = () => {
        setCadastroEmEdicao(null);
    };

    // Atualizar cadastro
    const atualizarCadastro = async (id, dados) => {
        try {
            const resposta = await axios.put(`/api/cadastros/${id}`, dados);
            setCadastros(cadastros.map(c => c.id === id ? resposta.data : c));
            setCadastroEmEdicao(null);
            toast.success('Cadastro atualizado com sucesso!');
            return { sucesso: true };
        } catch (erro) {
            console.error('Erro ao atualizar cadastro:', erro);

            if (erro.response && erro.response.data && erro.response.data.erros) {
                return {
                    sucesso: false,
                    erros: erro.response.data.erros.reduce((acc, curr) => {
                        acc[curr.campo] = curr.mensagem;
                        return acc;
                    }, {})
                };
            }

            toast.error('Erro ao atualizar cadastro');
            return { sucesso: false, erros: { geral: 'Erro ao processar solicitação' } };
        }
    };

    return (
        <div className="container">
            <header className="app-header">
                <h1 className="app-title">Formulário de Cadastro</h1>
                <p className="app-description">
                    Preencha o formulário abaixo para se cadastrar
                </p>
            </header>

            <FormularioCadastro
                adicionarCadastro={adicionarCadastro}
                atualizarCadastro={atualizarCadastro}
                cadastroEmEdicao={cadastroEmEdicao}
                cancelarEdicao={cancelarEdicao}
            />

            {erro && <div className="error-message">{erro}</div>}

            <ListaCadastros
                cadastros={cadastros}
                carregando={carregando}
                removerCadastro={removerCadastro}
                iniciarEdicao={iniciarEdicao}
            />
        </div>
    );
}

export default App; 
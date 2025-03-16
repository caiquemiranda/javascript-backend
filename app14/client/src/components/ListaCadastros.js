import React from 'react';

// Formata a data para o formato brasileiro
const formatarData = (dataString) => {
    if (!dataString) return '';

    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
};

function ListaCadastros({ cadastros, carregando, removerCadastro, iniciarEdicao }) {
    if (carregando) {
        return (
            <div className="lista-cadastros">
                <h2 className="lista-title">Lista de Cadastros</h2>
                <p className="loading">Carregando cadastros...</p>
            </div>
        );
    }

    if (cadastros.length === 0) {
        return (
            <div className="lista-cadastros">
                <h2 className="lista-title">Lista de Cadastros</h2>
                <p className="lista-vazia">Nenhum cadastro encontrado. Preencha o formulário acima para cadastrar.</p>
            </div>
        );
    }

    return (
        <div className="lista-cadastros">
            <h2 className="lista-title">
                Lista de Cadastros
                <span className="badge badge-success">{cadastros.length} cadastro(s)</span>
            </h2>

            <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Telefone</th>
                            <th>Data de Nascimento</th>
                            <th>Cidade/UF</th>
                            <th>Profissão</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cadastros.map(cadastro => (
                            <tr key={cadastro.id}>
                                <td>{cadastro.nome}</td>
                                <td>{cadastro.email}</td>
                                <td>{cadastro.telefone}</td>
                                <td>{formatarData(cadastro.dataNascimento)}</td>
                                <td>{cadastro.cidade}/{cadastro.estado}</td>
                                <td>{cadastro.profissao}</td>
                                <td>
                                    <button
                                        className="btn btn-primary btn-small"
                                        onClick={() => iniciarEdicao(cadastro)}
                                        title="Editar cadastro"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn btn-secondary btn-small"
                                        onClick={() => {
                                            if (window.confirm('Tem certeza que deseja excluir este cadastro?')) {
                                                removerCadastro(cadastro.id);
                                            }
                                        }}
                                        title="Remover cadastro"
                                        style={{ marginLeft: '5px' }}
                                    >
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ListaCadastros; 
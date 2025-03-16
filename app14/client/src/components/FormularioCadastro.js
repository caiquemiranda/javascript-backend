import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import InputMask from 'react-input-mask';

// Schema de validação com Yup
const validationSchema = Yup.object({
    nome: Yup.string()
        .min(3, 'O nome deve ter no mínimo 3 caracteres')
        .max(100, 'O nome deve ter no máximo 100 caracteres')
        .required('O nome é obrigatório'),

    email: Yup.string()
        .email('Email inválido')
        .required('O email é obrigatório'),

    telefone: Yup.string()
        .matches(/^\(\d{2}\)\s\d{5}-\d{4}$/, 'Telefone deve estar no formato (99) 99999-9999')
        .required('O telefone é obrigatório'),

    dataNascimento: Yup.date()
        .max(new Date(), 'A data de nascimento não pode ser no futuro')
        .required('A data de nascimento é obrigatória'),

    cidade: Yup.string()
        .min(2, 'A cidade deve ter no mínimo 2 caracteres')
        .required('A cidade é obrigatória'),

    estado: Yup.string()
        .length(2, 'O estado deve ser informado com 2 caracteres (sigla)')
        .required('O estado é obrigatório'),

    profissao: Yup.string()
        .min(2, 'A profissão deve ter no mínimo 2 caracteres')
        .required('A profissão é obrigatória')
});

// Estados brasileiros para select
const estados = [
    { sigla: 'AC', nome: 'Acre' },
    { sigla: 'AL', nome: 'Alagoas' },
    { sigla: 'AP', nome: 'Amapá' },
    { sigla: 'AM', nome: 'Amazonas' },
    { sigla: 'BA', nome: 'Bahia' },
    { sigla: 'CE', nome: 'Ceará' },
    { sigla: 'DF', nome: 'Distrito Federal' },
    { sigla: 'ES', nome: 'Espírito Santo' },
    { sigla: 'GO', nome: 'Goiás' },
    { sigla: 'MA', nome: 'Maranhão' },
    { sigla: 'MT', nome: 'Mato Grosso' },
    { sigla: 'MS', nome: 'Mato Grosso do Sul' },
    { sigla: 'MG', nome: 'Minas Gerais' },
    { sigla: 'PA', nome: 'Pará' },
    { sigla: 'PB', nome: 'Paraíba' },
    { sigla: 'PR', nome: 'Paraná' },
    { sigla: 'PE', nome: 'Pernambuco' },
    { sigla: 'PI', nome: 'Piauí' },
    { sigla: 'RJ', nome: 'Rio de Janeiro' },
    { sigla: 'RN', nome: 'Rio Grande do Norte' },
    { sigla: 'RS', nome: 'Rio Grande do Sul' },
    { sigla: 'RO', nome: 'Rondônia' },
    { sigla: 'RR', nome: 'Roraima' },
    { sigla: 'SC', nome: 'Santa Catarina' },
    { sigla: 'SP', nome: 'São Paulo' },
    { sigla: 'SE', nome: 'Sergipe' },
    { sigla: 'TO', nome: 'Tocantins' }
];

function FormularioCadastro({ adicionarCadastro, atualizarCadastro, cadastroEmEdicao, cancelarEdicao }) {
    // Valores iniciais do formulário
    const initialValues = {
        nome: '',
        email: '',
        telefone: '',
        dataNascimento: '',
        cidade: '',
        estado: '',
        profissao: ''
    };

    // Função para lidar com o envio do formulário
    const handleSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
        try {
            let resultado;

            if (cadastroEmEdicao) {
                resultado = await atualizarCadastro(cadastroEmEdicao.id, values);
            } else {
                resultado = await adicionarCadastro(values);
            }

            if (resultado.sucesso) {
                resetForm();
            } else if (resultado.erros) {
                setErrors(resultado.erros);
            }
        } catch (erro) {
            console.error('Erro ao processar formulário:', erro);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="form-container">
            <h2 className="form-title">
                {cadastroEmEdicao ? 'Editar Cadastro' : 'Novo Cadastro'}
            </h2>

            <Formik
                initialValues={cadastroEmEdicao || initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ isSubmitting, touched, errors, setFieldValue, values }) => (
                    <Form>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="nome" className="form-label">Nome Completo</label>
                                <Field
                                    type="text"
                                    id="nome"
                                    name="nome"
                                    className={`form-input ${touched.nome && errors.nome ? 'is-invalid' : ''}`}
                                    placeholder="Digite seu nome completo"
                                />
                                <ErrorMessage name="nome" component="div" className="error-feedback" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email" className="form-label">Email</label>
                                <Field
                                    type="email"
                                    id="email"
                                    name="email"
                                    className={`form-input ${touched.email && errors.email ? 'is-invalid' : ''}`}
                                    placeholder="exemplo@email.com"
                                />
                                <ErrorMessage name="email" component="div" className="error-feedback" />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="telefone" className="form-label">Telefone</label>
                                <Field name="telefone">
                                    {({ field }) => (
                                        <InputMask
                                            {...field}
                                            mask="(99) 99999-9999"
                                            id="telefone"
                                            type="text"
                                            className={`form-input ${touched.telefone && errors.telefone ? 'is-invalid' : ''}`}
                                            placeholder="(99) 99999-9999"
                                        />
                                    )}
                                </Field>
                                <ErrorMessage name="telefone" component="div" className="error-feedback" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="dataNascimento" className="form-label">Data de Nascimento</label>
                                <Field
                                    type="date"
                                    id="dataNascimento"
                                    name="dataNascimento"
                                    className={`form-input ${touched.dataNascimento && errors.dataNascimento ? 'is-invalid' : ''}`}
                                />
                                <ErrorMessage name="dataNascimento" component="div" className="error-feedback" />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="cidade" className="form-label">Cidade</label>
                                <Field
                                    type="text"
                                    id="cidade"
                                    name="cidade"
                                    className={`form-input ${touched.cidade && errors.cidade ? 'is-invalid' : ''}`}
                                    placeholder="Digite sua cidade"
                                />
                                <ErrorMessage name="cidade" component="div" className="error-feedback" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="estado" className="form-label">Estado</label>
                                <Field
                                    as="select"
                                    id="estado"
                                    name="estado"
                                    className={`form-input ${touched.estado && errors.estado ? 'is-invalid' : ''}`}
                                >
                                    <option value="">Selecione um estado</option>
                                    {estados.map(estado => (
                                        <option key={estado.sigla} value={estado.sigla}>
                                            {estado.sigla} - {estado.nome}
                                        </option>
                                    ))}
                                </Field>
                                <ErrorMessage name="estado" component="div" className="error-feedback" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="profissao" className="form-label">Profissão</label>
                            <Field
                                type="text"
                                id="profissao"
                                name="profissao"
                                className={`form-input ${touched.profissao && errors.profissao ? 'is-invalid' : ''}`}
                                placeholder="Digite sua profissão"
                            />
                            <ErrorMessage name="profissao" component="div" className="error-feedback" />
                        </div>

                        <div className="btn-group">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Processando...' : cadastroEmEdicao ? 'Atualizar' : 'Cadastrar'}
                            </button>

                            {cadastroEmEdicao && (
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={cancelarEdicao}
                                >
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default FormularioCadastro; 
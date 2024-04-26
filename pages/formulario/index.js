import React, { useState } from 'react';
import api from "../../config/configApi.js"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const Formulario = () => {
    const navigate = useNavigate()

    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        cpf: '',
        estado: '',
        cidade: '',
        cep: '',
        rua: ''
    });

    const [status, setStats] = useState({
        type: '',
        mensagem: ''
    });

    const usuariosUpdate = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        if (name === 'cpf') {
            newValue = value.replace(/\D/g, '');
            newValue = newValue.slice(0, 11);
        }

        if (name === 'email') {
            newValue = value.replace(/[^a-zA-Z0-9@.]/g, '');
        }

        if (name === 'password') {
            newValue = newValue.slice(0, 16);
        }


        setUser(prevState => ({
            ...prevState,
            [name]: newValue
        }));
    };

    const handleCEPChange = async (e) => {
        const cep = e.target.value.replace(/\D/g, '');

        setUser(prevState => ({
            ...prevState,
            cep: cep
        }));

        if (cep.length === 8) {
            try {
                const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
                const { uf, localidade, logradouro } = response.data;
                setUser(prevState => ({
                    ...prevState,
                    estado: uf,
                    cidade: localidade,
                    rua: logradouro
                }));
            } catch (error) {
                console.error('Erro ao buscar informações do CEP:', error);
            }
        }
    };

    const postSubmit = async e => {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (Object.values(user).some(value => value === '')) {
            setStats({
                type: 'error',
                mensagem: "Por favor, preencha todos os campos."
            });
            return;
        }

        try {
            await api.post('/formulario', user, { headers })
                .then((response) => {
                    setStats({
                        type: 'success',
                        mensagem: response.data.mensagem
                    });
                    navigate("/");
                });
        } catch (error) {
            if (error.response) {
                setStats({
                    type: 'error',
                    mensagem: error.response.data.mensagem
                });
            } else {
                setStats({
                    type: 'error',
                    mensagem: "Servidor está em manutenção, tente novamente mais tarde"
                });
            }
        }
    };

    return (
        <div>
            <header>
                <nav className="navbar navbar-expand-lg bg-body-tertiary " data-bs-theme="dark">
                    <div className="container-fluid">
                        <div className="dashboard-logo">

                        </div>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <a className="nav-link " aria-current="page" href="dashboard"><i
                                        className="bi bi-speedometer2"></i></a>
                                    <a href="./dashboard">
                                        <p className="nav-text">Dashboard</p>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link " href="./listar"><i className="bi bi-table"></i></a>
                                    <a href="./listar">
                                        <p className="nav-text">Listar</p>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link select" href="#"><i className="bi bi-door-open-fill"></i></a>
                                    <a href="#">
                                        <p className="nav-text select">Formulário</p>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link " href="./visualizar"><i className="bi bi-house"></i></a>
                                    <a href="./visualizar">
                                        <p className="nav-text ">Visualizar</p>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link " href="./alert"><i className="bi bi-exclamation-octagon-fill "></i></a>
                                    <a href="./alert">
                                        <p className="nav-text ">Alerta</p>
                                    </a>
                                </li>
                                <li className="nav-item dropdown">
                                    <a className="nav-link d" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown"
                                        aria-expanded="false">
                                        <i className="bi bi-person-circle"></i>
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                        <li className="d-flex">
                                            <a className="dropdown-item login" href="#">Login</a>
                                            <a className="dropdown-item cadastrar" href="#">Cadastrar</a>
                                        </li>
                                    </ul>
                                    <a href="#">
                                        <p className="nav-text">Custumers</p>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>

            <section>
                <div className="card-main">
                    {status.type === 'error' ? <p className='mensagemError'>{status.mensagem}</p> : ""}
                    <div className="head-card">
                        <h5 className="card-header">Cadastrar</h5>
                        <button className="btn-enviar" onClick={postSubmit} >Enviar</button>
                    </div>
                    <div className="card-body">
                        <form>
                            <div className="grid-layout">
                                <div className="div1">
                                    <p>Nome</p>
                                    <div className="input-group flex-nowrap">
                                        <input type="text" className="form-control" placeholder="Nome Completo" name="name" value={user.name} onChange={usuariosUpdate} required />
                                    </div>
                                </div>
                                <div className="div2">
                                    <p>Email</p>
                                    <div className="input-group flex-nowrap">
                                        <input type="text" className="form-control" placeholder="Meu Email" name="email" value={user.email} onChange={usuariosUpdate} required />
                                    </div>
                                </div>
                                <div className="div3">
                                    <p>Senha</p>
                                    <div className="input-group flex-nowrap">
                                        <input type="password" className="form-control" placeholder="Senha" name="password" value={user.password} onChange={usuariosUpdate} required />
                                    </div>
                                </div>
                                <div className="div4">
                                    <p>CPF</p>
                                    <div className="input-group flex-nowrap">
                                        <input type="text" className="form-control" placeholder="Meu CPF" name="cpf" value={user.cpf} onChange={usuariosUpdate} required />
                                    </div>
                                </div>
                                <div className="div5">
                                    <p>Estado</p>
                                    <div className="input-group flex-nowrap">
                                        <input type="text" className="form-control" placeholder="estado" name="estado" value={user.estado} onChange={usuariosUpdate} required />
                                    </div>
                                </div>
                                <div className="div6">
                                    <p>Cidade</p>
                                    <div className="input-group flex-nowrap">
                                        <input type="text" className="form-control" placeholder="cidade" name="cidade" value={user.cidade} onChange={usuariosUpdate} required />
                                    </div>
                                </div>
                                <div className="div7">
                                    <p>RUA</p>
                                    <div className="input-group flex-nowrap">
                                        <input type="text" className="form-control" placeholder="RUA" name="rua" value={user.rua} onChange={usuariosUpdate} required />
                                    </div>
                                </div>
                                <div className="div8">
                                    <p>CEP</p>
                                    <div className="input-group flex-nowrap">
                                        <input type="text" className="form-control" placeholder="CEP" name="cep" value={user.cep} onChange={handleCEPChange} required />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Formulario;

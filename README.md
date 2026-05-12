# 🐾 UNIPET — Sistema de Triagem Veterinária

<p align="center">
  <img src="https://img.shields.io/badge/versão-1.0.0-0d9488?style=for-the-badge" />
  <img src="https://img.shields.io/badge/licença-MIT-22c55e?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Node.js-v20.20.0-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/React-v19.2.6-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/PostgreSQL-18.3-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/OpenAI-GPT--4o-412991?style=for-the-badge&logo=openai&logoColor=white" />
</p>

<p align="center">
  Sistema inteligente de triagem veterinária com classificação por IA, painel de fila em tempo real e histórico completo de atendimentos.
</p>

---

## 📋 Índice

- [🐾 UNIPET — Sistema de Triagem Veterinária](#-unipet--sistema-de-triagem-veterinária)
  - [📋 Índice](#-índice)
  - [🩺 Sobre o Projeto](#-sobre-o-projeto)
  - [✅ Funcionalidades](#-funcionalidades)
  - [🏗 Arquitetura](#-arquitetura)
  - [🛠 Tecnologias](#-tecnologias)
    - [Backend](#backend)
    - [Frontend](#frontend)
  - [📦 Pré-requisitos](#-pré-requisitos)
  - [🚀 Instalação](#-instalação)
    - [1. Clone o repositório](#1-clone-o-repositório)
    - [2. Configure o banco de dados](#2-configure-o-banco-de-dados)
    - [3. Configure o Backend](#3-configure-o-backend)
    - [4. Configure o Frontend](#4-configure-o-frontend)
    - [5. Acesso inicial](#5-acesso-inicial)
  - [🔑 Variáveis de Ambiente](#-variáveis-de-ambiente)
  - [📁 Estrutura de Pastas](#-estrutura-de-pastas)
  - [🗄 Banco de Dados](#-banco-de-dados)
    - [Tabelas](#tabelas)
  - [🖥 Telas do Sistema](#-telas-do-sistema)
  - [🔌 API — Endpoints](#-api--endpoints)
    - [Autenticação](#autenticação)
    - [Triagens](#triagens)
    - [Tutores](#tutores)
    - [Animais](#animais)
  - [🤖 IA de Triagem](#-ia-de-triagem)
    - [Fluxo](#fluxo)
    - [Níveis de Prioridade](#níveis-de-prioridade)
  - [👩‍💻 Autor](#-autor)
  - [📄 Licença](#-licença)

---

## 🩺 Sobre o Projeto

O **UNIPET** é uma aplicação web fullstack desenvolvida para clínicas e hospitais veterinários que precisam organizar e priorizar o atendimento de animais com base na gravidade dos sintomas apresentados.

A triagem é classificada automaticamente por Inteligência Artificial (OpenAI GPT), que analisa os sintomas relatados e define o nível de prioridade: **URGENTE**, **MODERADO** ou **NORMAL**. Em caso de indisponibilidade da API, o sistema possui um mecanismo de fallback offline baseado em regras clínicas.

---

## ✅ Funcionalidades

- 🔐 **Autenticação** com JWT — login seguro por perfil (admin / recepção / veterinário)
- 📋 **Fila de Atendimento** — visualização em tempo real dos pacientes aguardando, ordenados por prioridade
- ➕ **Nova Triagem** — cadastro de sintomas com classificação automática via IA
- 📝 **Cadastros** — gerenciamento de tutores e animais
- 📁 **Histórico** — consulta de atendimentos concluídos com filtros por data, animal, tutor e prioridade
- 📄 **Laudo PDF** — geração e impressão de laudo veterinário por atendimento
- 📥 **Exportar CSV** — exportação do histórico com suporte a acentuação (UTF-8 BOM)
- 📺 **Painel TV** — tela de chamada para sala de espera, exibindo a fila em tempo real
- 🤖 **IA com fallback** — classificação inteligente com modo offline automático

---

## 🏗 Arquitetura

```
┌─────────────────────┐        HTTP/REST        ┌──────────────────────────┐
│                     │ ─────────────────────── │                          │
│   Frontend React    │       porta 3000         │   Backend Node/Express   │
│   (porta 3000)      │                          │      (porta 3001)        │
│                     │ ─────────────────────── │                          │
└─────────────────────┘                          └────────────┬─────────────┘
                                                              │
                                          ┌───────────────────┼────────────────────┐
                                          │                   │                    │
                                 ┌────────▼───────┐  ┌────────▼───────┐  ┌────────▼───────┐
                                 │  PostgreSQL DB  │  │   OpenAI API   │  │   PM2 Process  │
                                 │  unipet_db      │  │   GPT-4o       │  │   Manager      │
                                 └────────────────┘  └────────────────┘  └────────────────┘
```

---

## 🛠 Tecnologias

### Backend
| Tecnologia | Versão | Uso |
|---|---|---|
| Node.js | 20.20.0 | Runtime |
| Express | 5.2.1 | Framework HTTP |
| PostgreSQL | 18.3 | Banco de dados |
| pg | 8.20.0 | Driver PostgreSQL |
| jsonwebtoken | 9.0.3 | Autenticação JWT |
| openai | 6.34.0 | Classificação por IA |
| PM2 | — | Gerenciador de processos |

### Frontend
| Tecnologia | Versão | Uso |
|---|---|---|
| React | 19.2.6 | Interface do usuário |
| Axios | — | Requisições HTTP |
| CSS-in-JS | — | Estilização inline |

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) >= 20.x
- [npm](https://www.npmjs.com/) >= 10.x
- [PostgreSQL](https://www.postgresql.org/) >= 14
- [PM2](https://pm2.keymetrics.io/) — `npm install -g pm2`
- Chave de API da [OpenAI](https://platform.openai.com/account/api-keys) *(opcional — sistema funciona offline)*

---

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/MichellSCoelho/unipet.git
cd unipet
```

### 2. Configure o banco de dados

```bash
psql -U postgres
CREATE DATABASE unipet_db;
\q
```

Execute o script de criação das tabelas:

```bash
psql -U postgres -d unipet_db -f database/schema.sql
```

### 3. Configure o Backend

```bash
cd unipet-backend
npm install
cp .env.example .env
# Edite o .env com suas credenciais (ver seção abaixo)
```

Inicie com PM2:

```bash
pm2 start src/app.js --name unipet-backend --interpreter node
pm2 save
```

### 4. Configure o Frontend

```bash
cd ../unipet-frontend
npm install
npm start
```

O sistema estará disponível em:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001/api

### 5. Acesso inicial

| Campo | Valor |
|---|---|
| E-mail | admin@unipet.com |
| Senha | Admin@2025 |

---

## 🔑 Variáveis de Ambiente

Crie o arquivo `.env` dentro de `unipet-backend/` com base no `.env.example`:

```env
# Servidor
PORT=3001

# Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_NAME=unipet_db
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui

# Autenticação
JWT_SECRET=seu_segredo_jwt_aqui

# OpenAI (opcional — sistema usa fallback offline se ausente)
OPENAI_API_KEY=sk-...
```

> ⚠️ **Nunca versione o arquivo `.env`**. Ele já está no `.gitignore`.

---

## 📁 Estrutura de Pastas

```
unipet/
├── unipet-backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # Conexão PostgreSQL
│   │   ├── controllers/
│   │   │   ├── triagem.controller.js
│   │   │   ├── tutor.controller.js
│   │   │   └── animal.controller.js
│   │   ├── middlewares/
│   │   │   └── auth.middleware.js    # Verificação JWT
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── triagem.routes.js
│   │   │   ├── tutor.routes.js
│   │   │   └── animal.routes.js
│   │   ├── services/
│   │   │   └── ia.service.js         # Integração OpenAI + fallback
│   │   └── app.js
│   ├── .env.example
│   └── package.json
│
├── unipet-frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Fila.js
│   │   │   ├── NovaTriagem.js
│   │   │   ├── Cadastro.js
│   │   │   ├── Historico.js
│   │   │   └── PainelTV.js
│   │   ├── api.js                    # Instância Axios configurada
│   │   └── App.js                    # Roteamento e layout principal
│   └── package.json
│
└── README.md
```

---

## 🗄 Banco de Dados

### Tabelas

```sql
-- Usuários do sistema
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  perfil VARCHAR(20) DEFAULT 'recepcao', -- admin | recepcao | veterinario
  criado_em TIMESTAMP DEFAULT NOW()
);

-- Tutores (donos dos animais)
CREATE TABLE tutores (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  telefone VARCHAR(20),
  email VARCHAR(100),
  criado_em TIMESTAMP DEFAULT NOW()
);

-- Animais
CREATE TABLE animais (
  id SERIAL PRIMARY KEY,
  tutor_id INTEGER REFERENCES tutores(id),
  nome VARCHAR(100) NOT NULL,
  especie VARCHAR(50),
  raca VARCHAR(50),
  porte VARCHAR(20),      -- Pequeno | Médio | Grande
  peso_kg DECIMAL(5,2),
  criado_em TIMESTAMP DEFAULT NOW()
);

-- Triagens
CREATE TABLE triagens (
  id SERIAL PRIMARY KEY,
  animal_id INTEGER REFERENCES animais(id),
  sintomas TEXT NOT NULL,
  temperatura DECIMAL(4,1),
  prioridade_ia VARCHAR(20),     -- URGENTE | MODERADO | NORMAL
  justificativa_ia TEXT,
  status VARCHAR(20) DEFAULT 'aguardando', -- aguardando | em_atendimento | concluido | cancelado
  criado_em TIMESTAMP DEFAULT NOW()
);
```

---

## 🖥 Telas do Sistema

| Tela | Rota | Descrição |
|---|---|---|
| Login | `/` | Autenticação de usuários |
| Fila de Atendimento | `fila` | Lista de pacientes aguardando, ordenados por prioridade |
| Nova Triagem | `nova` | Formulário de cadastro com classificação por IA |
| Cadastros | `cadastro` | CRUD de tutores e animais |
| Histórico | `historico` | Atendimentos concluídos com filtros e laudo PDF |
| Painel TV | `painel` | Tela de chamada para sala de espera |

---

## 🔌 API — Endpoints

### Autenticação
| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/auth/login` | Login e geração de token JWT |

### Triagens
| Método | Rota | Auth | Descrição |
|---|---|---|---|
| POST | `/api/triagens` | ✅ | Criar nova triagem com classificação IA |
| GET | `/api/triagens/fila` | — | Listar fila ativa (aguardando + em atendimento) |
| GET | `/api/triagens/painel` | — | Dados para o Painel TV |
| GET | `/api/triagens/historico` | ✅ | Histórico paginado com filtros |
| GET | `/api/triagens/historico/animal/:id` | ✅ | Histórico completo de um animal |
| PUT | `/api/triagens/:id/status` | ✅ | Atualizar status da triagem |

### Tutores
| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/api/tutores` | ✅ | Listar tutores |
| POST | `/api/tutores` | ✅ | Cadastrar tutor |
| PUT | `/api/tutores/:id` | ✅ | Editar tutor |
| DELETE | `/api/tutores/:id` | ✅ | Remover tutor |

### Animais
| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/api/animais` | ✅ | Listar animais |
| POST | `/api/animais` | ✅ | Cadastrar animal |
| PUT | `/api/animais/:id` | ✅ | Editar animal |
| DELETE | `/api/animais/:id` | ✅ | Remover animal |

---

## 🤖 IA de Triagem

O serviço de IA analisa os sintomas informados e retorna a classificação de prioridade com justificativa clínica.

### Fluxo

```
Sintomas informados
        │
        ▼
┌───────────────────┐     sucesso     ┌──────────────────────┐
│  OpenAI GPT API   │ ──────────────► │  Classificação Real  │
└───────────────────┘                 │  URGENTE/MODERADO/   │
        │                             │  NORMAL + justif.    │
     erro 4xx/5xx                     └──────────────────────┘
        │
        ▼
┌───────────────────┐
│  Fallback Offline │ ──────────────► Regras clínicas locais
│  (regras locais)  │                 sem custo de API
└───────────────────┘
```

### Níveis de Prioridade

| Nível | Cor | Descrição |
|---|---|---|
| 🔴 URGENTE | Vermelho | Risco de vida — atendimento imediato |
| 🟡 MODERADO | Amarelo | Atenção — atendimento em até 2 horas |
| 🟢 NORMAL | Verde | Estável — fila padrão |

---

## 👩‍💻 Autor

Desenvolvido por **Michelle S. Coelho**

[![GitHub](https://img.shields.io/badge/GitHub-MichellSCoelho-181717?style=for-the-badge&logo=github)](https://github.com/MichellSCoelho)

---

## 📄 Licença

Este projeto está licenciado sob a **Licença MIT**.

```
MIT License

Copyright (c) 2026 Michelle S. Coelho

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<p align="center">
  Feito com 🐾 e muito ☕ por <a href="https://github.com/MichellSCoelho">Michelle S. Coelho</a>
</p>
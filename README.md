# Comanda Digital

Sistema web completo para gerenciamento de pedidos em dark kitchen, desenvolvido como trabalho acadêmico na UNASP SP.

**Instituição:** Centro Universitário Adventista de São Paulo (UNASP SP)  
**Disciplina:** Desenvolvimento Full-Stack (G01371.1)  
**Professor:** Thiago Silva  
**Semestre:** 2026/1  
**Dupla:** Iale Moreira e Vitor Amorim

---

## Tecnologias

**Backend**
- Java 17+
- Spring Boot 3.x
- Spring Security + JWT
- Spring Data JPA + Hibernate
- MySQL 8
- Flyway (migrations)
- SpringDoc OpenAPI (Swagger)

**Frontend**
- Angular 21
- TypeScript
- Chart.js (graficos do dashboard)
- Cloudinary (upload de imagens)

---

## Funcionalidades

**Area do Cliente**
- Cardapio publico com filtro por categoria e imagens
- Carrinho de compras com quantidade e observacoes
- Cadastro e login com JWT
- Checkout com calculo de frete por CEP
- Acompanhamento de status do pedido
- Historico de pedidos com avaliacao

**Painel Administrativo**
- Dashboard com KPIs e graficos (Chart.js)
- Gestao completa de pedidos com fluxo de status
- CRUD de pratos, categorias e ingredientes
- Fichas tecnicas com calculo de custo e food cost
- Controle de estoque com baixa automatica
- Gestao de fornecedores e pedidos de compra
- Alertas de estoque minimo

---

## Pre-requisitos

- Java 17 ou superior
- Node.js 20 ou superior
- Angular CLI 21 (`npm install -g @angular/cli`)
- MySQL 8
- Maven

---

## Como rodar o projeto

### 1. Banco de dados

Crie o banco de dados no MySQL:

```sql
CREATE DATABASE comanda_digital;
```

O Flyway vai criar todas as tabelas e inserir os dados de exemplo automaticamente ao subir o backend.

### 2. Backend (Spring Boot)

```bash
# Entrar na pasta do backend
cd comanda-digital-api

# Verificar o arquivo de configuracao
# src/main/resources/application.properties
# Ajuste usuario e senha do MySQL se necessario:
# spring.datasource.username=root
# spring.datasource.password=sua_senha

# Rodar o projeto
mvn spring-boot:run
```

O backend sobe em: `http://localhost:8080`

Documentacao da API (Swagger): `http://localhost:8080/swagger-ui.html`

### 3. Frontend (Angular)

```bash
# Entrar na pasta do frontend
cd comanda-digital

# Instalar dependencias
npm install

# Rodar o projeto
ng serve
```

O frontend sobe em: `http://localhost:4200`

---

## Credenciais padrao

**Administrador**
- Email: `admin@email.com`
- Senha: `senha123`

**Cliente de teste**
- Cadastre um novo cliente pela tela de cadastro em `/cadastro`

---

## Estrutura do projeto

```
comanda-digital/          # Frontend Angular
comanda-digital-api/      # Backend Spring Boot
```

**Estrutura do backend:**
```
src/main/java/com/unasp/comanda_digital/
  controller/   # Endpoints REST
  service/      # Logica de negocio
  repository/   # Interfaces JPA
  model/        # Entidades JPA
  dto/          # Objetos de request e response
  config/       # SecurityConfig, CorsConfig
  exception/    # Tratamento global de erros
```

---

## Endpoints principais

| Metodo | Endpoint | Descricao | Acesso |
|--------|----------|-----------|--------|
| POST | /api/auth/login | Login | Publico |
| POST | /api/auth/register | Cadastro de cliente | Publico |
| GET | /api/cardapio | Lista pratos ativos | Publico |
| POST | /api/pedidos | Criar pedido | Cliente |
| GET | /api/pedidos/meus | Historico de pedidos | Cliente |
| GET | /api/admin/pedidos | Listar todos os pedidos | Admin/Gerente |
| PATCH | /api/admin/pedidos/{id}/status | Mudar status | Admin/Gerente |
| GET | /api/admin/dashboard/resumo | KPIs do dia | Admin/Gerente |

Todos os endpoints estao documentados no Swagger em `/swagger-ui.html`.

---

## Observacoes para execucao

- O backend deve estar rodando antes de iniciar o frontend
- O MySQL deve estar ativo na porta 3306
- O Flyway cria as tabelas e dados automaticamente na primeira execucao
- As imagens dos pratos sao hospedadas no Cloudinary (nao requer configuracao local)
- O calculo de frete usa a API gratuita do ViaCEP (requer conexao com internet)


# Comanda Digital

Sistema web completo para gerenciamento de pedidos em dark kitchen, desenvolvido como trabalho academico na UNASP SP.

- **Frontend (producao):** https://comanda-digital-cdc52.web.app/cardapio
- **Backend (producao):** https://comanda-digital-api-production.up.railway.app
- **Documentacao da API:** https://comanda-digital-api-production.up.railway.app/swagger-ui/index.html

> O acesso direto ao backend no browser retorna 403 — isso e esperado. O Spring Security bloqueia requisicoes sem token JWT na raiz. O frontend consome a API normalmente via https://comanda-digital-cdc52.web.app/cardapio

---

## Instituicao

- **Instituicao:** Centro Universitario Adventista de Sao Paulo (UNASP SP)
- **Disciplina:** Desenvolvimento Full-Stack (G01371.1)
- **Professor:** Thiago Silva
- **Semestre:** 4
- **Dupla:** Iale Moreira e Vitor Amorim

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

**Infraestrutura**
- Frontend: Firebase Hosting
- Backend: Railway
- Banco de dados: Railway MySQL

---

## Funcionalidades

**Area do Cliente**
- Cardapio publico com filtro por categoria e imagens
- Carrinho de compras com quantidade e observacoes
- Cadastro e login com JWT
- Checkout com calculo de frete por CEP (ViaCEP)
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

## Como rodar localmente

**Pre-requisitos**
- Java 17 ou superior
- Node.js 20 ou superior
- Angular CLI 21: `npm install -g @angular/cli`
- MySQL 8
- Maven

### 1. Banco de dados

```sql
CREATE DATABASE comanda_digital;
```

O Flyway cria todas as tabelas e insere os dados de exemplo automaticamente ao subir o backend.

### 2. Backend (Spring Boot)

```bash
cd comanda-digital-api
mvn spring-boot:run
```

O backend sobe em: http://localhost:8080

Documentacao da API (Swagger): http://localhost:8080/swagger-ui/index.html

> No Windows, caso necessario definir o JAVA_HOME antes de rodar:
> ```
> set JAVA_HOME=C:\Users\1\.jdks\openjdk-26.0.1
> mvnw.cmd spring-boot:run
> ```

### 3. Frontend (Angular)

```bash
cd comanda-digital
npm install
ng serve
```

O frontend sobe em: http://localhost:4200

---

## Credenciais padrao

**Administrador**
- Email: admin@email.com
- Senha: senha123

**Cliente de teste**
- Cadastre um novo cliente pela tela de cadastro em /cadastro

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

Todos os endpoints estao documentados no Swagger em `/swagger-ui/index.html`.

---

## Observacoes

- O backend deve estar rodando antes de iniciar o frontend
- O MySQL deve estar ativo na porta 3306 (local) ou via Railway (producao)
- O Flyway cria as tabelas e dados automaticamente na primeira execucao
- As imagens dos pratos sao hospedadas no Cloudinary (nao requer configuracao local)
- O calculo de frete usa a API gratuita do ViaCEP (requer conexao com internet)

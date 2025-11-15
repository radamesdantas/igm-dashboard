# IGM Dashboard - Sistema de Gerenciamento de Serviços

Sistema completo para gerenciamento dos serviços da Igreja em Mossoró, desenvolvido com React + Vite no frontend e Node.js + Express no backend.

## Funcionalidades

- Dashboard com visão geral de todos os serviços
- Gerenciamento completo de serviços (CRUD)
- Sistema de ações mensais para cada serviço
- Registro de reuniões com resumos e decisões
- Filtros e busca por serviços, ações e meses
- Interface responsiva e moderna
- Dados importados da planilha original

## Tecnologias Utilizadas

### Frontend
- React 18
- Vite (build tool)
- Tailwind CSS (estilização)
- React Router (navegação)
- Axios (requisições HTTP)

### Backend
- Node.js
- Express (framework web)
- Banco de dados JSON (persistência em arquivo)
- CORS habilitado

## Estrutura do Projeto

```
igm-dashboard/
├── backend/
│   ├── routes/          # Rotas da API
│   ├── database.js      # Gerenciamento do banco de dados
│   ├── server.js        # Servidor Express
│   ├── importar-csv.js  # Script de importação de dados
│   ├── db.json          # Banco de dados (criado automaticamente)
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── pages/       # Páginas da aplicação
    │   ├── services/    # Serviços de API
    │   ├── App.jsx      # Componente principal
    │   └── main.jsx     # Entrada da aplicação
    ├── index.html
    └── package.json
```

## Instalação

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn

### Passo 1: Clonar/Acessar o Projeto
O projeto já está criado em: `C:\Users\Usuário\igm-dashboard`

### Passo 2: Instalar Dependências
As dependências já foram instaladas! Mas caso precise reinstalar:

**Backend:**
```bash
cd C:\Users\Usuário\igm-dashboard\backend
npm install
```

**Frontend:**
```bash
cd C:\Users\Usuário\igm-dashboard\frontend
npm install
```

### Passo 3: Importar Dados (Opcional)
Os dados da planilha já foram importados! Para reimportar:
```bash
cd C:\Users\Usuário\igm-dashboard\backend
node importar-csv.js
```

## Como Executar

### Iniciar o Backend
Abra um terminal e execute:
```bash
cd C:\Users\Usuário\igm-dashboard\backend
npm start
```

O servidor estará rodando em: http://localhost:3001

### Iniciar o Frontend
Abra outro terminal e execute:
```bash
cd C:\Users\Usuário\igm-dashboard\frontend
npm run dev
```

A aplicação estará disponível em: http://localhost:3000

## Uso do Sistema

### Dashboard
- Acesse http://localhost:3000 para ver a visão geral
- Cards com estatísticas gerais
- Tabela de ações por mês com percentual de conclusão
- Top 5 serviços com mais ações

### Gerenciar Serviços
1. Clique em "Serviços" no menu
2. Use a busca para filtrar por nome, supervisor ou coordenador
3. Clique em "Ver Detalhes" para acessar um serviço específico
4. No detalhe do serviço você pode:
   - Adicionar novas ações
   - Atualizar status de ações existentes
   - Registrar reuniões
   - Ver histórico completo

### Adicionar Novo Serviço
1. Clique em "Novo Serviço"
2. Preencha os dados:
   - Número (deve ser único)
   - Nome do serviço
   - Supervisor (opcional)
   - Coordenador(es) (opcional)
3. Clique em "Criar Serviço"

### Gerenciar Ações
1. Acesse um serviço específico
2. Clique em "Nova Ação"
3. Preencha:
   - Mês
   - Descrição
   - Status (Pendente, Concluída, Não Realizada)
4. Você pode alterar o status de uma ação a qualquer momento

### Registrar Reuniões
1. Acesse um serviço específico
2. Clique em "Nova Reunião"
3. Preencha:
   - Data
   - Mês
   - Participantes
   - Resumo
   - Decisões
4. As reuniões ficam ordenadas por data

### Ver Todas as Ações
- Clique em "Ações" no menu
- Use os filtros para visualizar por mês ou status
- Veja estatísticas consolidadas

## API Endpoints

### Serviços
- `GET /api/servicos` - Listar todos os serviços
- `GET /api/servicos/:id` - Obter um serviço específico
- `POST /api/servicos` - Criar novo serviço
- `PUT /api/servicos/:id` - Atualizar serviço
- `DELETE /api/servicos/:id` - Remover serviço

### Ações
- `GET /api/acoes` - Listar todas as ações
- `GET /api/acoes/servico/:servico_id` - Ações de um serviço
- `POST /api/acoes` - Criar nova ação
- `PUT /api/acoes/:id` - Atualizar ação
- `DELETE /api/acoes/:id` - Remover ação

### Reuniões
- `GET /api/reunioes` - Listar todas as reuniões
- `GET /api/reunioes/servico/:servico_id` - Reuniões de um serviço
- `POST /api/reunioes` - Criar nova reunião
- `PUT /api/reunioes/:id` - Atualizar reunião
- `DELETE /api/reunioes/:id` - Remover reunião

### Dashboard
- `GET /api/dashboard` - Estatísticas gerais

## Dados Importados

O sistema já possui os seguintes dados importados da planilha:
- 27 Serviços
- 53 Ações distribuídas pelos meses
- Supervisores e Coordenadores atribuídos

## Backup dos Dados

Todos os dados ficam armazenados em: `backend/db.json`

Para fazer backup:
1. Copie o arquivo `db.json` para um local seguro
2. Para restaurar, substitua o arquivo `db.json`

## Próximos Passos (Melhorias Futuras)

- Adicionar autenticação e autorização
- Sistema de notificações por email
- Exportar relatórios em PDF
- Gráficos mais detalhados
- Aplicativo mobile
- Integração com calendário
- Sistema de anexos/documentos

## Suporte

Para dúvidas ou problemas:
1. Verifique se backend e frontend estão rodando
2. Confira o console do navegador para erros
3. Verifique o terminal do backend para logs

## Licença

MIT License - Projeto desenvolvido para a Igreja em Mossoró

---

Desenvolvido com dedicação para melhor gestão dos serviços da igreja.

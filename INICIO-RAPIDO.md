# Guia de Início Rápido - IGM Dashboard

## Como Iniciar o Sistema (2 passos simples)

### 1. Iniciar o Backend

Abra o **PowerShell** ou **Prompt de Comando** e execute:

```bash
cd C:\Users\Usuário\igm-dashboard\backend
npm start
```

Você verá:
```
🚀 Servidor rodando em http://localhost:3001
📊 Dashboard: http://localhost:3001/api/dashboard
📋 Serviços: http://localhost:3001/api/servicos
```

**Deixe este terminal aberto!**

---

### 2. Iniciar o Frontend

Abra um **NOVO** terminal (PowerShell ou Prompt) e execute:

```bash
cd C:\Users\Usuário\igm-dashboard\frontend
npm run dev
```

Você verá algo como:
```
VITE v5.0.8  ready in 500 ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

---

### 3. Acessar o Sistema

Abra seu navegador e acesse:

**http://localhost:3000**

Pronto! O sistema está funcionando!

---

## Atalhos Úteis

### Para Windows - Criar Scripts de Inicialização

**Criar arquivo `iniciar-backend.bat`:**
```batch
@echo off
cd C:\Users\Usuário\igm-dashboard\backend
npm start
pause
```

**Criar arquivo `iniciar-frontend.bat`:**
```batch
@echo off
cd C:\Users\Usuário\igm-dashboard\frontend
npm run dev
pause
```

Basta clicar duplo nos arquivos `.bat` para iniciar!

---

## Parar o Sistema

Para parar os servidores:
- Pressione `Ctrl + C` em cada terminal
- Ou simplesmente feche os terminais

---

## Solução de Problemas Comuns

### Erro: "Porta já em uso"
Se aparecer que a porta 3000 ou 3001 já está em uso:

**Backend (porta 3001):**
```bash
# Encontrar processo na porta 3001
netstat -ano | findstr :3001
# Matar o processo (substitua PID pelo número encontrado)
taskkill /PID <numero> /F
```

**Frontend (porta 3000):**
```bash
# Encontrar processo na porta 3000
netstat -ano | findstr :3000
# Matar o processo
taskkill /PID <numero> /F
```

### Erro: "Cannot find module"
Reinstale as dependências:

```bash
# Backend
cd C:\Users\Usuário\igm-dashboard\backend
npm install

# Frontend
cd C:\Users\Usuário\igm-dashboard\frontend
npm install
```

### Página em branco no navegador
1. Verifique se o backend está rodando (http://localhost:3001)
2. Abra o Console do navegador (F12) e veja se há erros
3. Verifique se ambos os terminais estão abertos

---

## Acessar Dados Diretamente

Você pode acessar os dados diretamente pela API:

- **Dashboard:** http://localhost:3001/api/dashboard
- **Todos os serviços:** http://localhost:3001/api/servicos
- **Todas as ações:** http://localhost:3001/api/acoes
- **Banco de dados:** Abra o arquivo `backend/db.json` em qualquer editor de texto

---

## Primeiro Acesso - O que fazer

1. Explore o **Dashboard** - veja estatísticas gerais
2. Clique em **Serviços** - veja todos os 27 serviços importados
3. Escolha um serviço e clique em **Ver Detalhes**
4. Experimente:
   - Adicionar uma nova ação
   - Registrar uma reunião
   - Alterar o status de uma ação

---

## Estrutura Visual do Sistema

```
Dashboard (Página Inicial)
├── Estatísticas Gerais (Cards)
├── Ações por Mês (Tabela)
└── Top 5 Serviços (Lista)

Serviços
├── Busca por nome/supervisor/coordenador
├── Lista de todos os serviços
└── Botão "Ver Detalhes" → Página do Serviço
    ├── Informações do Serviço
    ├── Ações (por mês)
    │   ├── Adicionar nova ação
    │   └── Alterar status
    └── Reuniões
        └── Registrar nova reunião

Ações
├── Filtros (mês, status)
├── Estatísticas
└── Lista consolidada de todas as ações
```

---

Qualquer dúvida, consulte o **README.md** completo!

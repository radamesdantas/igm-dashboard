# 🚀 Guia de Deploy - IGM Dashboard

Este guia explica como fazer o deploy do sistema em serviços gratuitos na nuvem.

## Opção 1: Render.com (Recomendado - Mais Fácil)

### Vantagens:
- ✅ 100% Gratuito
- ✅ Não precisa de cartão de crédito
- ✅ Deploy automático com Git
- ✅ HTTPS grátis
- ✅ Interface super simples

### Passo a Passo:

#### 1. Criar Conta no GitHub
1. Acesse [github.com](https://github.com)
2. Crie uma conta gratuita (se ainda não tiver)

#### 2. Criar Repositório
1. Clique em "New repository"
2. Nome: `igm-dashboard`
3. Deixe como **Public**
4. Clique em "Create repository"

#### 3. Subir o Código para o GitHub

Abra o terminal/PowerShell na pasta do projeto e execute:

```bash
cd C:\Users\Usuário\igm-dashboard

# Inicializar git
git init

# Adicionar todos os arquivos
git add .

# Fazer primeiro commit
git commit -m "Deploy inicial IGM Dashboard"

# Adicionar origin (substitua SEU-USUARIO pelo seu usuário do GitHub)
git remote add origin https://github.com/SEU-USUARIO/igm-dashboard.git

# Enviar para o GitHub
git push -u origin main
```

Se pedir senha, use um **Personal Access Token**:
- GitHub > Settings > Developer Settings > Personal Access Tokens > Generate new token
- Marque "repo" e copie o token
- Use o token como senha

#### 4. Deploy no Render

1. Acesse [render.com](https://render.com)
2. Clique em "Get Started for Free"
3. Faça login com sua conta do GitHub
4. Clique em "New +" > "Web Service"
5. Conecte seu repositório `igm-dashboard`
6. Configurações:
   - **Name**: `igm-dashboard`
   - **Environment**: `Node`
   - **Build Command**:
     ```
     npm run install-backend && npm run install-frontend && npm run build
     ```
   - **Start Command**:
     ```
     npm start
     ```
   - **Plan**: `Free`
7. Clique em "Create Web Service"

#### 5. Aguardar Deploy
- O Render vai fazer o build (leva uns 5-10 minutos)
- Você verá os logs em tempo real
- Quando terminar, terá um link tipo: `https://igm-dashboard.onrender.com`

#### 6. Acessar seu Sistema
Pronto! Seu sistema estará online em:
**https://igm-dashboard.onrender.com**

---

## Opção 2: Railway.app

### Vantagens:
- ✅ Muito rápido
- ✅ Interface moderna
- ✅ 500 horas/mês grátis
- ⚠️ Precisa de cartão de crédito (mas não cobra)

### Passo a Passo:

1. Acesse [railway.app](https://railway.app)
2. Clique em "Start a New Project"
3. Faça login com GitHub
4. Escolha "Deploy from GitHub repo"
5. Selecione seu repositório `igm-dashboard`
6. Railway detecta automaticamente Node.js
7. Clique em "Deploy Now"
8. Aguarde o build
9. Clique em "Generate Domain" para ter uma URL pública

Seu site ficará em algo como: `https://igm-dashboard-production.up.railway.app`

---

## Opção 3: Vercel (Alternativa)

### Vantagens:
- ✅ Muito rápido
- ✅ Grátis
- ✅ Excelente para frontend

### Limitação:
- Backend tem limitações (serverless)
- Melhor para sites estáticos

---

## Após o Deploy

### Importar Dados Iniciais

Se quiser importar os dados da planilha no servidor:

1. Acesse o dashboard do Render/Railway
2. Vá em "Shell" ou "Console"
3. Execute:
```bash
cd backend
node importar-csv.js
```

### URL Final

Depois do deploy, você terá um link público tipo:
- Render: `https://igm-dashboard.onrender.com`
- Railway: `https://igm-dashboard.up.railway.app`

Compartilhe esse link com quem precisar acessar!

---

## Atualizar o Sistema

Quando você fizer alterações:

```bash
cd C:\Users\Usuário\igm-dashboard
git add .
git commit -m "Descrição da alteração"
git push
```

O Render/Railway detecta automaticamente e faz um novo deploy!

---

## Problemas Comuns

### Build falhou
- Verifique se o build command está correto
- Veja os logs para identificar o erro

### Site muito lento (Render)
- No plano grátis do Render, o servidor "dorme" após 15 minutos sem uso
- Ao acessar novamente, leva ~30 segundos para "acordar"
- É normal no plano grátis

### Dados não aparecem
- Verifique se o banco `db.json` foi criado
- Execute o script de importação

---

## Próximo Passo

Siga a **Opção 1 (Render)** que é a mais simples e totalmente gratuita!

Precisa de ajuda? Me avise!

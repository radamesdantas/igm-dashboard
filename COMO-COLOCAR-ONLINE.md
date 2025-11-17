# 🚀 Como Colocar o IGM Dashboard Online

Este guia mostra como colocar o sistema IGM Dashboard online gratuitamente usando:
- **Netlify** para o Frontend (React)
- **Render** para o Backend (Node.js)

## 📋 Pré-requisitos

1. Conta no GitHub (gratuita)
2. Conta no Netlify (gratuita)
3. Conta no Render (gratuita)

---

## 📦 Passo 1: Preparar o Projeto no GitHub

### 1.1 Instalar Git (se ainda não tiver)
- Baixe em: https://git-scm.com/downloads
- Instale com as configurações padrão

### 1.2 Criar Repositório no GitHub

1. Acesse https://github.com e faça login
2. Clique no botão **"+"** no canto superior direito
3. Selecione **"New repository"**
4. Preencha:
   - **Repository name**: `igm-dashboard`
   - **Description**: Sistema de Gerenciamento de Serviços - Igreja em Mossoró
   - Marque como **Private** (se quiser manter privado)
5. Clique em **"Create repository"**

### 1.3 Subir o Projeto para o GitHub

Abra o terminal/prompt de comando na pasta do projeto e execute:

```bash
cd C:\Users\Usuário\igm-dashboard

# Inicializar git (se ainda não foi feito)
git init

# Criar arquivo .gitignore
echo node_modules/ >> .gitignore
echo .env >> .gitignore
echo .env.local >> .gitignore
echo dist/ >> .gitignore

# Adicionar todos os arquivos
git add .

# Fazer o primeiro commit
git commit -m "Sistema IGM Dashboard completo com Metas 2026"

# Conectar ao repositório do GitHub (substitua SEU-USUARIO pelo seu usuário)
git remote add origin https://github.com/SEU-USUARIO/igm-dashboard.git

# Enviar para o GitHub
git branch -M main
git push -u origin main
```

---

## 🖥️ Passo 2: Deploy do Backend (Render)

### 2.1 Criar Conta no Render

1. Acesse https://render.com
2. Clique em **"Get Started"**
3. Faça cadastro com sua conta do GitHub

### 2.2 Criar Web Service

1. No dashboard do Render, clique em **"New +"**
2. Selecione **"Web Service"**
3. Conecte seu repositório do GitHub (`igm-dashboard`)
4. Clique em **"Connect"**

### 2.3 Configurar o Web Service

Preencha as configurações:

- **Name**: `igm-dashboard-backend`
- **Region**: Escolha a região mais próxima (ex: Oregon - US West)
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Instance Type**: `Free`

### 2.4 Adicionar Variáveis de Ambiente

Na seção **"Environment"**, adicione:

```
NODE_ENV=production
PORT=10000
```

### 2.5 Deploy

1. Clique em **"Create Web Service"**
2. Aguarde o deploy (leva 2-5 minutos)
3. Quando terminar, você verá uma URL tipo: `https://igm-dashboard-backend.onrender.com`

**⚠️ IMPORTANTE**: Copie essa URL, você vai precisar dela!

### 2.6 Testar o Backend

Acesse no navegador:
```
https://igm-dashboard-backend.onrender.com/api/dashboard
```

Se aparecer dados JSON, está funcionando! ✅

---

## 🌐 Passo 3: Deploy do Frontend (Netlify)

### 3.1 Criar Conta no Netlify

1. Acesse https://netlify.com
2. Clique em **"Sign up"**
3. Faça cadastro com sua conta do GitHub

### 3.2 Criar Novo Site

1. No dashboard do Netlify, clique em **"Add new site"**
2. Selecione **"Import an existing project"**
3. Escolha **"GitHub"**
4. Autorize o Netlify a acessar seus repositórios
5. Selecione o repositório `igm-dashboard`

### 3.3 Configurar o Build

O Netlify deve detectar automaticamente as configurações do arquivo `netlify.toml`.

Verifique se está assim:

- **Base directory**: `frontend`
- **Build command**: `npm install && npm run build`
- **Publish directory**: `frontend/dist`

### 3.4 Adicionar Variável de Ambiente

**MUITO IMPORTANTE!**

Antes de fazer o deploy, adicione a variável de ambiente:

1. Clique em **"Add environment variables"** (ou vá em Site settings > Environment variables)
2. Adicione:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://igm-dashboard-backend.onrender.com/api`
     (Use a URL do seu backend do Render que você copiou no Passo 2.5)

### 3.5 Deploy

1. Clique em **"Deploy site"**
2. Aguarde o deploy (leva 1-3 minutos)
3. Quando terminar, você verá uma URL tipo: `https://adorable-unicorn-123456.netlify.app`

### 3.6 Personalizar URL (Opcional)

1. Vá em **Site settings > Domain management**
2. Clique em **"Options"** ao lado do domínio
3. Clique em **"Edit site name"**
4. Escolha um nome: `igm-dashboard` (se disponível)
5. Agora sua URL será: `https://igm-dashboard.netlify.app`

---

## 🔐 Passo 4: Atualizar CORS no Backend

Agora que você tem a URL do Netlify, precisa atualizar o CORS:

1. Abra o arquivo `backend/server.js` no seu computador
2. Localize a linha com `'https://igm-dashboard.netlify.app'`
3. Substitua pelo seu domínio real do Netlify
4. Salve o arquivo
5. Faça commit e push:

```bash
git add backend/server.js
git commit -m "Atualizar CORS com URL do Netlify"
git push
```

O Render vai fazer deploy automático em alguns minutos.

---

## ✅ Passo 5: Testar o Sistema Online

1. Acesse seu site no Netlify: `https://seu-site.netlify.app`
2. Faça login (use as credenciais padrão se tiver)
3. Teste criar uma meta
4. Verifique se tudo está funcionando

**Se der erro de CORS**:
- Certifique-se que a URL do backend está correta no Netlify (variável `VITE_API_URL`)
- Certifique-se que a URL do frontend está correta no CORS do backend

---

## 🎯 URLs Finais

Depois de tudo configurado:

- **Frontend**: https://igm-dashboard.netlify.app
- **Backend API**: https://igm-dashboard-backend.onrender.com/api

---

## 📝 Observações Importantes

### Sobre o Plano Gratuito do Render

O backend no Render (plano gratuito) tem algumas limitações:

- **"Spin Down"**: Após 15 minutos de inatividade, o servidor "dorme"
- **Primeiro Acesso**: Pode levar 30-50 segundos para "acordar"
- **Solução**: O frontend vai mostrar "Carregando..." enquanto o backend inicia

### Atualizações Futuras

Sempre que fizer alterações no código:

```bash
# Adicionar alterações
git add .

# Fazer commit
git commit -m "Descrição da alteração"

# Enviar para GitHub
git push
```

Render e Netlify farão deploy automático! ✨

---

## 🆘 Problemas Comuns

### Frontend não carrega dados

1. Verifique se a variável `VITE_API_URL` está correta no Netlify
2. Acesse a API diretamente para testar: `https://seu-backend.onrender.com/api/dashboard`

### Erro de CORS

1. Verifique se o domínio do Netlify está no CORS do backend
2. Certifique-se que fez push das alterações do `server.js`

### Backend demora muito

- Normal no primeiro acesso (plano gratuito "dorme")
- Aguarde 30-50 segundos no primeiro acesso

### Dados não persistem

- No plano gratuito do Render, o arquivo `db.json` é resetado a cada deploy
- **Solução futura**: Usar um banco de dados real (MongoDB Atlas - também gratuito)

---

## 🔄 Próximos Passos (Opcional)

Para melhorar o sistema em produção:

1. **Adicionar banco de dados real** (MongoDB Atlas gratuito)
2. **Configurar domínio próprio** (tipo: `dashboard.igrejaemmossoro.com.br`)
3. **Adicionar autenticação real** (JWT tokens)
4. **Configurar SSL/HTTPS** (Netlify já faz automaticamente)

---

## 📞 Suporte

Se tiver dúvidas:
- Documentação Netlify: https://docs.netlify.com
- Documentação Render: https://render.com/docs
- Documentação Vite: https://vitejs.dev

---

**Parabéns! Seu sistema agora está online e acessível de qualquer lugar! 🎉**

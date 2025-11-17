# 🚀 Deploy Completo no Netlify (TUDO EM UM LUGAR!)

Este guia mostra como colocar **TUDO** (Frontend + Backend) no Netlify gratuitamente!

**Vantagens:**
- ✅ Tudo em um único lugar
- ✅ Um único deploy
- ✅ Sem problemas de CORS
- ✅ 100% gratuito
- ✅ SSL automático (HTTPS)

**Tempo: ~10 minutos**

---

## 📋 O que você precisa

1. Conta no GitHub (gratuita) - https://github.com
2. Conta no Netlify (gratuita) - https://netlify.com

---

## 🎯 Passo 1: Colocar no GitHub (5 minutos)

### 1.1 Instalar Git

Se ainda não tiver Git instalado:
1. Baixe em: https://git-scm.com/downloads
2. Instale com as configurações padrão

### 1.2 Criar Repositório no GitHub

1. Acesse https://github.com e faça login
2. Clique no botão **"+"** no canto superior direito
3. Selecione **"New repository"**
4. Preencha:
   - **Repository name**: `igm-dashboard`
   - **Description**: Dashboard IGM - Igreja em Mossoró
   - Pode deixar **Public** ou **Private** (você escolhe)
5. Clique em **"Create repository"**

### 1.3 Enviar o Projeto

Abra o **Prompt de Comando** (CMD) ou **Terminal** e execute:

```bash
# Ir para a pasta do projeto
cd C:\Users\Usuário\igm-dashboard

# Inicializar git (se ainda não foi feito)
git init

# Adicionar todos os arquivos
git add .

# Fazer o commit
git commit -m "Sistema IGM Dashboard completo com Metas 2026"

# Conectar ao GitHub (SUBSTITUA SEU-USUARIO pelo seu nome de usuário do GitHub)
git remote add origin https://github.com/SEU-USUARIO/igm-dashboard.git

# Enviar para o GitHub
git branch -M main
git push -u origin main
```

**⚠️ IMPORTANTE**: Substitua `SEU-USUARIO` pelo seu nome de usuário do GitHub!

---

## 🌐 Passo 2: Deploy no Netlify (5 minutos)

### 2.1 Criar Conta

1. Acesse https://netlify.com
2. Clique em **"Sign up"**
3. Escolha **"Sign up with GitHub"** (mais fácil!)
4. Autorize o Netlify

### 2.2 Importar o Projeto

1. No dashboard do Netlify, clique em **"Add new site"**
2. Selecione **"Import an existing project"**
3. Escolha **"Deploy with GitHub"**
4. Encontre e selecione seu repositório `igm-dashboard`

### 2.3 Configurar o Build

O Netlify deve detectar automaticamente as configurações do `netlify.toml`.

Verifique se está assim:
- **Base directory**: `frontend`
- **Build command**: `npm install && npm run build`
- **Publish directory**: `frontend/dist`
- **Functions directory**: `netlify/functions`

Se não aparecer automaticamente, adicione manualmente.

### 2.4 Fazer o Deploy

1. Clique em **"Deploy igm-dashboard"**
2. Aguarde o build (leva 2-5 minutos)
3. Quando aparecer **"Site is live"**, clique no link!

---

## ✅ Pronto! Seu Site Está Online!

Você verá uma URL tipo:
```
https://adorable-unicorn-123456.netlify.app
```

### Personalizar a URL (Opcional)

1. No Netlify, vá em **"Site settings"**
2. Em **"Site details"**, clique em **"Change site name"**
3. Escolha um nome: `igm-dashboard` (se disponível)
4. Agora sua URL será: `https://igm-dashboard.netlify.app`

---

## 🎉 Tudo Funcionando!

Agora você tem:
- ✅ **Frontend** rodando no Netlify
- ✅ **Backend (API)** rodando como Netlify Functions
- ✅ **Banco de dados** (arquivo JSON) funcionando
- ✅ **HTTPS** seguro automático
- ✅ **URL única** para tudo

### Testar

Acesse sua URL e teste:
1. Login
2. Ver serviços
3. Criar uma meta
4. Ver dashboard

---

## 🔄 Fazer Atualizações

Quando você fizer alterações no código:

```bash
# Na pasta do projeto
git add .
git commit -m "Descrição da alteração"
git push
```

O Netlify faz deploy automático em 2-3 minutos! ✨

---

## ⚠️ Observações Importantes

### Sobre o Banco de Dados

O arquivo `db.json` será reinicializado a cada deploy.

**Soluções:**

1. **Para desenvolvimento/teste**: Tudo bem, os dados são apenas para testar
2. **Para produção real**: Precisará migrar para um banco real (MongoDB Atlas gratuito)

Se quiser manter dados entre deploys:
- Use MongoDB Atlas (gratuito) - vou criar um guia se precisar
- Use Supabase (gratuito)
- Use Firebase (gratuito)

### Limites do Plano Gratuito

O Netlify gratuito tem:
- ✅ 100 GB de largura de banda/mês (suficiente para começar)
- ✅ 125.000 invocações de functions/mês (muito!)
- ✅ SSL gratuito
- ✅ Deploy contínuo
- ✅ Sem limite de sites

Para uma igreja, é mais que suficiente! 🎉

---

## 🆘 Problemas?

### Deploy falhou

1. Verifique se o código está no GitHub
2. Veja os logs de build no Netlify
3. Certifique-se que todos os arquivos foram commitados

### Site não carrega

1. Aguarde 2-3 minutos após o deploy
2. Limpe o cache do navegador (Ctrl+Shift+R)
3. Verifique a URL

### API não funciona

1. Veja as **Functions logs** no Netlify
2. Certifique-se que a pasta `netlify/functions` está no repositório
3. Verifique se `backend/**` está commitado

---

## 📞 Próximos Passos

Agora que está online, você pode:

1. **Compartilhar o link** com a equipe da igreja
2. **Testar em diferentes dispositivos** (celular, tablet)
3. **Adicionar um domínio próprio** (tipo: dashboard.igrejaemmossoro.com.br)
4. **Configurar MongoDB** para dados permanentes (se precisar)

---

## 🎯 Resumo do que Fizemos

1. ✅ Código no GitHub
2. ✅ Frontend no Netlify
3. ✅ Backend nas Netlify Functions
4. ✅ Tudo funcionando em uma URL
5. ✅ Deploy automático configurado

**Custo total: R$ 0,00** 💰

---

**Parabéns! Seu sistema está completamente online! 🎉**

Agora é só usar e curtir! Se precisar de ajuda para adicionar banco de dados real ou domínio próprio, é só avisar!

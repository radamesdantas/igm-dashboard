# 🚀 Deploy no Vercel (Frontend + Backend)

Guia completo para colocar o IGM Dashboard online no Vercel GRATUITAMENTE!

**Tempo: ~5 minutos**

---

## 🎯 Por Que Vercel?

✅ **100% Gratuito** - Plano generoso
✅ **Muito Rápido** - CDN global
✅ **Deploy Automático** - Cada push no GitHub faz deploy
✅ **Serverless Backend** - Backend incluído
✅ **SSL Automático** - HTTPS grátis
✅ **Ilimitado** - Projetos e bandwidth generosos

**Limites Gratuitos:**
- 100 GB bandwidth/mês
- Projetos ilimitados
- Serverless functions ilimitadas
- Domínio personalizado gratuito

---

## 📋 O Que Você Precisa

1. Conta no GitHub (você já tem!)
2. Conta no Vercel (vamos criar agora)

---

## 🚀 Passo 1: Criar Conta no Vercel (1 minuto)

### 1.1 Acessar o Vercel

1. Acesse: **https://vercel.com**
2. Clique em **"Sign Up"** (Cadastrar)
3. Escolha **"Continue with GitHub"** (Continuar com GitHub)
4. Autorize o Vercel a acessar seu GitHub
5. Pronto! Conta criada!

---

## 🌐 Passo 2: Fazer Deploy (3 minutos)

### 2.1 Importar o Projeto

1. No dashboard do Vercel, clique em **"Add New..."**
2. Selecione **"Project"**
3. Clique em **"Import Git Repository"**
4. Encontre **"igm-dashboard"** na lista
5. Clique em **"Import"**

### 2.2 Configurar o Projeto

O Vercel detectará automaticamente tudo! Verifique se está assim:

**Framework Preset:** Vite
**Root Directory:** `./` (raiz)
**Build Command:** (será detectado do vercel.json)
**Output Directory:** `frontend/dist`

### 2.3 Variáveis de Ambiente (Opcional - Google Sheets)

**Se você vai usar Google Sheets** como banco de dados:

1. Clique em **"Environment Variables"**
2. Adicione:

```
GOOGLE_SHEET_ID = seu_id_da_planilha
GOOGLE_SERVICE_ACCOUNT_KEY = {"type":"service_account",...}
USE_GOOGLE_SHEETS = true
```

**Se vai usar db.json:** Não adicione nada, o sistema usará o arquivo JSON automaticamente.

### 2.4 Fazer Deploy

1. Clique em **"Deploy"**
2. Aguarde 2-3 minutos
3. 🎉 **Site no ar!**

---

## ✅ Seu Site Está Online!

Você verá uma URL tipo:
```
https://igm-dashboard.vercel.app
```

ou

```
https://igm-dashboard-abc123.vercel.app
```

---

## 🎨 Personalizar a URL (Opcional)

### Trocar o Nome

1. No dashboard do Vercel, vá em **"Settings"**
2. Em **"Domains"**, você pode:
   - Mudar o subdomínio: `seu-nome.vercel.app`
   - Adicionar domínio próprio: `dashboard.suaigreja.com.br`

---

## 🔄 Deploy Automático

**Cada vez que você fizer push no GitHub:**
1. Vercel detecta automaticamente
2. Faz build e deploy
3. Em 2-3 minutos, mudanças estão online!

Exemplo:
```bash
git add .
git commit -m "Adiciona nova feature"
git push
```

Vercel faz deploy sozinho! ✨

---

## 📊 Configurar Google Sheets (Opcional)

Se quiser usar Google Sheets como banco de dados:

1. Siga o guia: **`GOOGLE-SHEETS-SETUP.md`**
2. Configure as variáveis de ambiente no Vercel:
   - Vá em **"Settings"** → **"Environment Variables"**
   - Adicione `GOOGLE_SHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_KEY`, e `USE_GOOGLE_SHEETS=true`
3. Faça novo deploy (Vercel faz automaticamente)

---

## 📱 Acessar de Qualquer Dispositivo

**No Computador:**
- Acesse: `https://seu-site.vercel.app`

**No Celular:**
- Abra o navegador
- Digite a mesma URL
- Interface responsiva funciona perfeitamente!

**Dados Sincronizados:**
- Todos os dispositivos veem os mesmos dados
- Se usar Google Sheets, edições aparecem em todos

---

## 🎯 Estrutura do Deploy

```
Vercel:
├── Frontend (React + Vite)
│   └── Servido do /frontend/dist
│
└── Backend (Serverless API)
    └── Rodando em /api/*
```

**Tudo em um lugar:**
- Frontend: `https://seu-site.vercel.app`
- API: `https://seu-site.vercel.app/api/*`

---

## ⚙️ Arquivos de Configuração

O sistema já está configurado com:

**`vercel.json`**
```json
{
  "version": 2,
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/index"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**`api/index.js`**
```javascript
import app from '../backend/server.js';
export default app;
```

Tudo já está pronto! Só fazer deploy!

---

## 🔍 Monitorar Deploys

### Ver Logs

1. No Vercel, vá em **"Deployments"**
2. Clique no deploy mais recente
3. Veja os logs em tempo real

### Verificar Erros

Se algo der errado:
1. Vá em **"Deployments"**
2. Clique no deploy com erro
3. Veja os logs detalhados
4. Corrija e faça push novamente

---

## 🆘 Problemas Comuns

### Build Falhou

**Erro:** `Command failed: npm install`
**Solução:** Verifique se o package.json está correto

**Erro:** `Module not found`
**Solução:** Verifique as importações no código

### API Não Funciona

**Erro:** `404 Not Found` nas rotas /api/
**Solução:**
1. Verifique se a pasta `/api/` está no repositório
2. Verifique se `vercel.json` está configurado corretamente

### Variáveis de Ambiente

**Erro:** Google Sheets não funciona
**Solução:**
1. Vá em Settings → Environment Variables
2. Adicione as variáveis necessárias
3. Faça novo deploy (ou clique em "Redeploy")

---

## 📈 Monitoramento

### Analytics

O Vercel oferece analytics gratuitos:
1. Vá em **"Analytics"**
2. Veja:
   - Número de visitas
   - Tempo de carregamento
   - Erros
   - E mais!

### Logs em Tempo Real

1. Vá em **"Logs"**
2. Veja requisições em tempo real
3. Depure problemas

---

## 🎁 Recursos Extras

### Preview Deploys

- Cada Pull Request no GitHub gera um deploy de preview
- Teste antes de mergear para main
- URL única para cada PR

### Rollback

Se um deploy quebrar:
1. Vá em **"Deployments"**
2. Encontre um deploy antigo que funcionava
3. Clique em **"..."** → **"Promote to Production"**
4. Site volta para versão antiga instantaneamente!

---

## 💰 Custos

**Plano Gratuito:**
- ✅ TUDO que você precisa está no plano gratuito!
- ✅ 100 GB bandwidth/mês (muito!)
- ✅ Unlimited projetos
- ✅ Unlimited serverless functions
- ✅ Não precisa cartão de crédito

**Quando precisar pagar?**
- Só se passar de 100 GB/mês (improvável para igreja)
- Ou se quiser recursos premium (não necessário)

---

## 🔐 Segurança

### SSL/HTTPS

- ✅ SSL automático e gratuito
- ✅ Renovação automática
- ✅ Sempre seguro

### Variáveis de Ambiente

- ✅ Criptografadas
- ✅ Nunca aparecem nos logs
- ✅ Seguras

---

## 🎉 Pronto!

Agora seu sistema está:

✅ Online 24/7
✅ Acessível de qualquer lugar
✅ Deploy automático
✅ SSL seguro
✅ Rápido (CDN global)
✅ 100% gratuito

---

## 📞 Próximos Passos

1. ✅ Compartilhe a URL com a equipe
2. ✅ Teste em diferentes dispositivos
3. ✅ Configure Google Sheets (opcional)
4. ✅ Adicione domínio próprio (opcional)

---

## 🆘 Precisa de Ajuda?

- **Documentação Vercel:** https://vercel.com/docs
- **Suporte:** help@vercel.com
- **Status:** https://www.vercel-status.com

---

**Parabéns! Seu sistema está completamente online! 🎉**

Custo total: **R$ 0,00** 💰

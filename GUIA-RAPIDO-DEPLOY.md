# 🚀 Guia Rápido - Deploy Online

## Resumo em 3 Passos

### 1️⃣ GitHub (5 minutos)
```bash
cd C:\Users\Usuário\igm-dashboard
git init
git add .
git commit -m "IGM Dashboard completo"
git remote add origin https://github.com/SEU-USUARIO/igm-dashboard.git
git push -u origin main
```

### 2️⃣ Backend no Render (5 minutos)
1. Acesse https://render.com
2. Conecte com GitHub
3. Novo Web Service → Escolha repositório `igm-dashboard`
4. Configurações:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Environment: `NODE_ENV=production`
5. Deploy
6. **Copie a URL**: `https://igm-dashboard-backend.onrender.com`

### 3️⃣ Frontend no Netlify (5 minutos)
1. Acesse https://netlify.com
2. Conecte com GitHub
3. Novo Site → Escolha repositório `igm-dashboard`
4. **IMPORTANTE**: Adicione variável de ambiente:
   - Key: `VITE_API_URL`
   - Value: `https://igm-dashboard-backend.onrender.com/api`
5. Deploy
6. Pronto! Seu site estará em: `https://seu-site.netlify.app`

---

## ✅ Checklist

- [ ] Projeto no GitHub
- [ ] Backend no Render
- [ ] Frontend no Netlify
- [ ] Variável `VITE_API_URL` configurada
- [ ] CORS atualizado com URL do Netlify
- [ ] Sistema testado online

---

## 📱 URLs Finais

- **Aplicação**: https://igm-dashboard.netlify.app
- **API**: https://igm-dashboard-backend.onrender.com/api

---

**Tempo total**: ~15 minutos
**Custo**: R$ 0,00 (100% gratuito)

Para instruções detalhadas, veja: `COMO-COLOCAR-ONLINE.md`

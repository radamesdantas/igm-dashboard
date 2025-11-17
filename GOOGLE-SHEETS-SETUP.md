# 📊 Configurar Google Sheets como Banco de Dados

Este guia mostra como usar o Google Sheets como banco de dados para o IGM Dashboard.

**Tempo: ~15 minutos**

---

## 🎯 Vantagens do Google Sheets

✅ Editar dados direto na planilha
✅ Compartilhar com a equipe
✅ Backup automático do Google
✅ Histórico de alterações
✅ Não precisa fazer deploy para atualizar dados
✅ Acessar e editar de qualquer lugar

---

## 📋 Passo 1: Criar uma Planilha do Google

1. Acesse https://sheets.google.com
2. Clique em **"+ Em branco"** para criar nova planilha
3. Renomeie para **"IGM Dashboard Database"**
4. **IMPORTANTE:** Copie o ID da planilha da URL

Exemplo de URL:
```
https://docs.google.com/spreadsheets/d/1ABC123xyz456/edit
                                       ^^^^^^^^^^^^
                                       Este é o ID!
```

5. Salve este ID, você vai precisar dele!

---

## 🔑 Passo 2: Criar Credenciais da API do Google

### 2.1 Acessar o Google Cloud Console

1. Acesse https://console.cloud.google.com
2. Faça login com sua conta Google
3. Clique em **"Selecionar um projeto"** no topo
4. Clique em **"NOVO PROJETO"**
5. Nome do projeto: `IGM Dashboard`
6. Clique em **"CRIAR"**

### 2.2 Ativar a API do Google Sheets

1. No menu lateral, vá em **"APIs e Serviços"** → **"Biblioteca"**
2. Busque por: **"Google Sheets API"**
3. Clique em **"Google Sheets API"**
4. Clique em **"ATIVAR"**

### 2.3 Criar Service Account (Conta de Serviço)

1. No menu lateral, vá em **"APIs e Serviços"** → **"Credenciais"**
2. Clique em **"+ CRIAR CREDENCIAIS"**
3. Selecione **"Conta de serviço"**
4. Preencha:
   - **Nome**: `igm-dashboard-service`
   - **ID**: (será preenchido automaticamente)
   - **Descrição**: `Service account para IGM Dashboard`
5. Clique em **"CRIAR E CONTINUAR"**
6. Em **"Conceder acesso ao projeto"**, selecione:
   - **Papel**: `Editor`
7. Clique em **"CONCLUIR"**

### 2.4 Baixar a Chave JSON

1. Na lista de contas de serviço, clique na que você acabou de criar
2. Vá na aba **"CHAVES"**
3. Clique em **"ADICIONAR CHAVE"** → **"Criar nova chave"**
4. Selecione o tipo **"JSON"**
5. Clique em **"CRIAR"**
6. O arquivo JSON será baixado automaticamente
7. **IMPORTANTE:** Guarde este arquivo em local seguro!

O arquivo JSON terá este formato:
```json
{
  "type": "service_account",
  "project_id": "igm-dashboard-xxxxx",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...",
  "client_email": "igm-dashboard-service@igm-dashboard-xxxxx.iam.gserviceaccount.com",
  "client_id": "123456789...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  ...
}
```

---

## 📝 Passo 3: Compartilhar a Planilha

1. Volte para sua planilha do Google Sheets
2. Clique em **"Compartilhar"** no canto superior direito
3. Cole o **email da service account** (está no arquivo JSON como `client_email`)
   - Exemplo: `igm-dashboard-service@igm-dashboard-xxxxx.iam.gserviceaccount.com`
4. Defina a permissão como **"Editor"**
5. **DESMARQUE** a opção "Notificar pessoas"
6. Clique em **"Compartilhar"**

---

## ⚙️ Passo 4: Configurar Variáveis de Ambiente

### 4.1 Localmente (para testar no seu computador)

1. Crie um arquivo `.env` na pasta `backend`:

```bash
cd C:\Users\Usuário\igm-dashboard\backend
```

2. Crie o arquivo `.env` com este conteúdo:

```env
# ID da planilha (copie da URL)
GOOGLE_SHEET_ID=SEU_ID_DA_PLANILHA_AQUI

# Chave da Service Account (copie TODO o conteúdo do arquivo JSON)
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"..."}

# Usar Google Sheets como banco de dados
USE_GOOGLE_SHEETS=true
```

**IMPORTANTE:** A variável `GOOGLE_SERVICE_ACCOUNT_KEY` deve conter TODO o JSON em uma única linha!

### 4.2 No Netlify (para produção)

1. Acesse https://app.netlify.com
2. Entre no seu site
3. Vá em **"Site settings"** → **"Environment variables"**
4. Adicione estas variáveis:

**GOOGLE_SHEET_ID:**
```
SEU_ID_DA_PLANILHA_AQUI
```

**GOOGLE_SERVICE_ACCOUNT_KEY:**
```json
{"type":"service_account","project_id":"igm-dashboard-xxxxx","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"igm-dashboard-service@...","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}
```

**USE_GOOGLE_SHEETS:**
```
true
```

5. Salve as variáveis
6. Faça um novo deploy

---

## 📊 Passo 5: Estrutura da Planilha

O sistema criará automaticamente 6 abas na planilha:

1. **servicos** - Todos os serviços da igreja
2. **acoes** - Ações de cada serviço
3. **reunioes** - Reuniões registradas
4. **metas** - Metas 2026
5. **submetas** - Submetas e marcos intermediários
6. **atualizacoesMetas** - Histórico de atualizações de progresso

**Não renomeie ou delete estas abas!**

---

## ✅ Passo 6: Testar a Integração

### 6.1 Atualizar o código para usar Google Sheets

No arquivo `backend/server.js`, troque a linha de importação do database:

**DE:**
```javascript
import database from './database.js';
```

**PARA:**
```javascript
import database from './database-sheets.js';
```

### 6.2 Reiniciar o servidor

```bash
# Pare o servidor (Ctrl+C)
# Inicie novamente
npm start
```

### 6.3 Verificar se funcionou

Você deve ver no console:
```
✅ Google Sheets conectado com sucesso!
✅ Criadas X abas novas
✅ Google Sheets Database inicializado!
🚀 Servidor rodando em http://localhost:3001
```

### 6.4 Testar criando um serviço

1. Acesse http://localhost:3000
2. Faça login
3. Vá em "Serviços" → "Novo Serviço"
4. Crie um serviço de teste
5. Abra sua planilha do Google Sheets
6. **Você verá o serviço aparecer na aba "servicos"!** 🎉

---

## 🔄 Migrar Dados Existentes

Se você já tem dados no `db.json`, pode migrá-los para o Google Sheets:

### Opção 1: Copiar manualmente

1. Abra o arquivo `backend/db.json`
2. Para cada tipo de dado (servicos, acoes, etc.):
   - Copie os dados
   - Cole na aba correspondente do Google Sheets
   - Formate como tabela

### Opção 2: Script de migração (vou criar se precisar)

Me avise se quiser que eu crie um script automático de migração!

---

## 🎨 Editar Dados Direto na Planilha

Agora você pode:

1. Abrir a planilha do Google Sheets
2. Editar qualquer dado diretamente
3. As mudanças aparecerão no dashboard automaticamente!

**IMPORTANTE:**
- Não altere a primeira linha (cabeçalhos)
- Não altere a coluna `id`
- Mantenha o formato dos dados (números como números, datas como datas)

---

## 📱 Compartilhar com a Equipe

Compartilhe a planilha com pessoas da equipe para que possam:
- Ver os dados
- Editar diretamente
- Colaborar em tempo real

---

## ⚠️ Observações Importantes

### Performance
- O sistema usa cache de 30 segundos
- Dados são atualizados a cada 30 segundos
- Para forçar atualização, reinicie o servidor

### Segurança
- **NUNCA** commit o arquivo `.env` para o Git
- **NUNCA** compartilhe a chave JSON publicamente
- Mantenha o arquivo JSON em local seguro

### Backup
- O Google Sheets faz backup automático
- Você pode ver o histórico de versões em "Arquivo" → "Histórico de versões"

---

## 🆘 Problemas Comuns

### Erro: "Error 403: Forbidden"
**Solução:** Certifique-se de que compartilhou a planilha com o email da service account

### Erro: "Error: Unable to parse"
**Solução:** Verifique se o JSON da service account está correto e em uma linha só

### Dados não aparecem
**Solução:** Aguarde 30 segundos ou reinicie o servidor para limpar o cache

### Planilha não criou as abas
**Solução:** Verifique as permissões da service account (deve ser "Editor")

---

## 📞 Próximos Passos

Agora que está tudo configurado:

1. ✅ Teste criando serviços, ações e metas
2. ✅ Edite dados direto na planilha
3. ✅ Compartilhe com a equipe
4. ✅ Faça deploy no Netlify com as variáveis de ambiente

---

**Parabéns! Você configurou o Google Sheets como banco de dados! 🎉**

Agora seus dados estão sincronizados e acessíveis de qualquer lugar!

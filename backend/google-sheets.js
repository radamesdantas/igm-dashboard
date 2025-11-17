import { google } from 'googleapis';

class GoogleSheetsDB {
  constructor() {
    this.sheets = null;
    this.spreadsheetId = process.env.GOOGLE_SHEET_ID;
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;

    try {
      // Configurar autenticação
      const auth = new google.auth.GoogleAuth({
        credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '{}'),
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      const authClient = await auth.getClient();
      this.sheets = google.sheets({ version: 'v4', auth: authClient });
      this.initialized = true;

      console.log('✅ Google Sheets conectado com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao conectar ao Google Sheets:', error.message);
      throw error;
    }
  }

  // Ler dados de uma aba
  async read(sheetName, range = 'A:Z') {
    await this.init();

    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!${range}`,
      });

      const rows = response.data.values || [];
      if (rows.length === 0) return [];

      // Primeira linha são os cabeçalhos
      const headers = rows[0];
      const data = [];

      // Converter linhas em objetos
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const obj = {};

        headers.forEach((header, index) => {
          const value = row[index] || '';

          // Tentar converter para número ou boolean
          if (value === 'true') obj[header] = true;
          else if (value === 'false') obj[header] = false;
          else if (!isNaN(value) && value !== '') obj[header] = Number(value);
          else obj[header] = value;
        });

        data.push(obj);
      }

      return data;
    } catch (error) {
      console.error(`Erro ao ler aba ${sheetName}:`, error.message);
      return [];
    }
  }

  // Escrever dados em uma aba (substituir tudo)
  async write(sheetName, data) {
    await this.init();

    if (!data || data.length === 0) {
      console.log(`Nenhum dado para escrever em ${sheetName}`);
      return;
    }

    try {
      // Obter cabeçalhos das chaves do primeiro objeto
      const headers = Object.keys(data[0]);

      // Converter objetos em arrays
      const rows = [headers];
      data.forEach(item => {
        const row = headers.map(header => {
          const value = item[header];
          // Converter boolean e null para string
          if (typeof value === 'boolean') return value.toString();
          if (value === null || value === undefined) return '';
          return value.toString();
        });
        rows.push(row);
      });

      // Limpar aba
      await this.sheets.spreadsheets.values.clear({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A:Z`,
      });

      // Escrever novos dados
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A1`,
        valueInputOption: 'RAW',
        resource: {
          values: rows,
        },
      });

      console.log(`✅ Aba ${sheetName} atualizada com ${data.length} registros`);
    } catch (error) {
      console.error(`Erro ao escrever na aba ${sheetName}:`, error.message);
      throw error;
    }
  }

  // Adicionar uma linha
  async append(sheetName, data) {
    await this.init();

    try {
      const headers = Object.keys(data);
      const values = headers.map(header => {
        const value = data[header];
        if (typeof value === 'boolean') return value.toString();
        if (value === null || value === undefined) return '';
        return value.toString();
      });

      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A:A`,
        valueInputOption: 'RAW',
        resource: {
          values: [values],
        },
      });

      console.log(`✅ Registro adicionado em ${sheetName}`);
    } catch (error) {
      console.error(`Erro ao adicionar registro em ${sheetName}:`, error.message);
      throw error;
    }
  }

  // Atualizar uma linha específica
  async update(sheetName, rowIndex, data) {
    await this.init();

    try {
      // Ler todos os dados
      const allData = await this.read(sheetName);

      // Atualizar o item
      if (rowIndex >= 0 && rowIndex < allData.length) {
        allData[rowIndex] = { ...allData[rowIndex], ...data };

        // Reescrever tudo
        await this.write(sheetName, allData);

        console.log(`✅ Linha ${rowIndex + 1} atualizada em ${sheetName}`);
      }
    } catch (error) {
      console.error(`Erro ao atualizar linha em ${sheetName}:`, error.message);
      throw error;
    }
  }

  // Deletar uma linha
  async delete(sheetName, rowIndex) {
    await this.init();

    try {
      // Ler todos os dados
      const allData = await this.read(sheetName);

      // Remover o item
      if (rowIndex >= 0 && rowIndex < allData.length) {
        allData.splice(rowIndex, 1);

        // Reescrever tudo
        await this.write(sheetName, allData);

        console.log(`✅ Linha ${rowIndex + 1} removida de ${sheetName}`);
      }
    } catch (error) {
      console.error(`Erro ao deletar linha de ${sheetName}:`, error.message);
      throw error;
    }
  }

  // Criar abas se não existirem
  async setupSheets() {
    await this.init();

    const sheetsToCreate = [
      'servicos',
      'acoes',
      'reunioes',
      'metas',
      'submetas',
      'atualizacoesMetas'
    ];

    try {
      // Obter abas existentes
      const response = await this.sheets.spreadsheets.get({
        spreadsheetId: this.spreadsheetId,
      });

      const existingSheets = response.data.sheets.map(sheet => sheet.properties.title);

      // Criar abas faltantes
      const requests = [];
      sheetsToCreate.forEach(sheetName => {
        if (!existingSheets.includes(sheetName)) {
          requests.push({
            addSheet: {
              properties: {
                title: sheetName,
              },
            },
          });
        }
      });

      if (requests.length > 0) {
        await this.sheets.spreadsheets.batchUpdate({
          spreadsheetId: this.spreadsheetId,
          resource: {
            requests,
          },
        });
        console.log(`✅ Criadas ${requests.length} abas novas`);
      }
    } catch (error) {
      console.error('Erro ao criar abas:', error.message);
      throw error;
    }
  }
}

export default new GoogleSheetsDB();

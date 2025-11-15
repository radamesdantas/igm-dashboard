import fs from 'fs';
import { parse } from 'csv-parse/sync';
import db from './database.js';

// Caminho para o arquivo CSV
const csvPath = 'C:\\Users\\Usuário\\Downloads\\IGM - Dashboard - Serviços.csv';

console.log('📥 Iniciando importação do CSV...\n');

try {
  // Ler o arquivo CSV
  const fileContent = fs.readFileSync(csvPath, 'utf-8');

  // Parse do CSV
  const records = parse(fileContent, {
    columns: false,
    skip_empty_lines: true,
    from_line: 4, // Pular as primeiras 3 linhas (cabeçalho)
  });

  const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  let servicosImportados = 0;
  let acoesImportadas = 0;

  for (const record of records) {
    const [n, supervisor, coordenador, nomeServico, ...mesesData] = record;

    // Pular linhas vazias ou sem nome de serviço
    if (!nomeServico || nomeServico.trim() === '' || nomeServico === 'Principais ações:') {
      continue;
    }

    const numero = parseInt(n);
    if (isNaN(numero)) continue;

    try {
      // Inserir serviço
      const servico = db.servicos.create({
        numero,
        nome: nomeServico.trim(),
        supervisor: supervisor ? supervisor.trim() : null,
        coordenador: coordenador ? coordenador.trim() : null
      });

      servicosImportados++;

      // Importar ações de cada mês
      mesesData.forEach((acao, index) => {
        if (acao && acao.trim() !== '') {
          const mes = meses[index];
          const descricao = acao.trim();

          // Determinar status baseado no conteúdo
          let status = 'pendente';
          if (descricao.toLowerCase().includes('não teve reunião')) {
            status = 'nao_realizada';
          } else if (descricao.toLowerCase().includes('realizado') ||
                     descricao.toLowerCase().includes('concluído') ||
                     index < 3) { // Assumir que meses passados foram realizados
            status = 'concluida';
          }

          db.acoes.create({
            servico_id: servico.id,
            mes,
            descricao,
            status
          });

          acoesImportadas++;
        }
      });
    } catch (error) {
      console.error(`Erro ao importar serviço ${numero}:`, error.message);
    }
  }

  console.log('✅ Importação concluída com sucesso!');
  console.log(`   📋 Serviços importados: ${servicosImportados}`);
  console.log(`   📝 Ações importadas: ${acoesImportadas}\n`);

} catch (error) {
  console.error('❌ Erro ao importar CSV:', error.message);
  process.exit(1);
}

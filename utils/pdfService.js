import PDFDocument from 'pdfkit';

export function gerarComandaPDF(comanda) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        size: [226, 600], // 80mm de largura, altura fixa
        margin: 10
      });

      const chunks = [];
      
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // 🎯 CABEÇALHO - Fonte 6pt (bem pequena)
      doc.fontSize(6)
         .font('Helvetica-Bold')
         .text(`Comanda #${comanda.id || comanda.nome}`, { align: 'center' });

      doc.moveDown(0.4);

      // 📋 CABEÇALHO DA TABELA - Fonte 5pt
      doc.fontSize(5)
         .font('Helvetica-Bold');

      // Posições das colunas
      const col1 = 10;  // Desc
      const col2 = 120; // Qtd
      const col3 = 140; // V. Unit
      const col4 = 180; // Total

      // Cabeçalho da tabela
      doc.text('Desc', col1, doc.y)
         .text('Qtd', col2, doc.y)
         .text('V. Unit', col3, doc.y)
         .text('Total', col4, doc.y);

      doc.moveDown(0.3);

      // Linha separadora do cabeçalho
      doc.moveTo(10, doc.y)
         .lineTo(216, doc.y)
         .stroke();

      doc.moveDown(0.2);

      let totalGeral = 0;

      // 🛒 ITENS DA TABELA - Fonte 4pt (muito pequena)
      if (comanda.itens && comanda.itens.length > 0) {
        comanda.itens.forEach((item, index) => {
          const subtotal = item.quantidade * item.valor;
          totalGeral += subtotal;

          doc.fontSize(4)
             .font('Helvetica');

          // Nome do produto
          doc.text(item.nome, col1, doc.y);
          
          // Quantidade
          doc.text(item.quantidade.toString(), col2, doc.y);
          
          // Valor unitário
          doc.text(`R$ ${item.valor.toFixed(2)}`, col3, doc.y);
          
          // Total do item
          doc.text(`R$ ${subtotal.toFixed(2)}`, col4, doc.y);

          doc.moveDown(0.15);
        });
      } else {
        doc.fontSize(4)
           .font('Helvetica')
           .text('Nenhum item encontrado', { align: 'center' });
      }

      doc.moveDown(0.3);

      // 📦 LINHA SEPARADORA FINAL
      doc.moveTo(10, doc.y)
         .lineTo(216, doc.y)
         .stroke();

      doc.moveDown(0.3);

      // 💰 TOTAL FINAL - Fonte 6pt
      doc.fontSize(6)
         .font('Helvetica-Bold')
         .text(`Total: R$ ${(comanda.total || totalGeral).toFixed(2)}`, { align: 'center' });

      doc.moveDown(0.4);

      // 📄 RODAPÉ - Fonte 3pt
      doc.fontSize(3)
         .font('Helvetica')
         .text('Obrigado pela preferência!', { align: 'center' });

      doc.end();

    } catch (error) {
      reject(error);
    }
  });
}

export function gerarRelatorioVendasPDF(dados, periodo) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        size: 'A4',
        margin: 40
      });

      const chunks = [];
      
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // CABEÇALHO
      doc.fontSize(16)
         .font('Helvetica-Bold')
         .text('RELATÓRIO DE VENDAS', { align: 'center' });

      doc.fontSize(12)
         .font('Helvetica')
         .text(`Período: ${periodo}`, { align: 'center' });

      doc.moveDown(1);

      // RESUMO
      doc.fontSize(14)
         .font('Helvetica-Bold')
         .text('RESUMO:', { align: 'left' });

      doc.fontSize(11)
         .font('Helvetica')
         .text(`Total de Comandas: ${dados.totalComandas}`)
         .text(`Total de Quartos: ${dados.totalQuartos}`)
         .text(`Receita Total: R$ ${dados.receitaTotal.toFixed(2)}`);

      doc.moveDown(1);

      // COMANDAS DETALHADAS
      if (dados.comandas && dados.comandas.length > 0) {
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .text('COMANDAS:', { align: 'left' });

        dados.comandas.forEach((comanda, index) => {
          doc.fontSize(10)
             .font('Helvetica')
             .text(`${index + 1}. ${comanda.nome} - R$ ${comanda.total.toFixed(2)} - ${new Date(comanda.encerradaEm).toLocaleDateString('pt-BR')}`);
        });
      }

      doc.end();

    } catch (error) {
      reject(error);
    }
  });
}
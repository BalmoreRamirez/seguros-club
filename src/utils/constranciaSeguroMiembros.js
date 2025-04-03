import jsPDF from "jspdf";
import "jspdf-autotable";

export const constranciaSeguroMiembros = (clubName, columns, data) => {
  const doc = new jsPDF();
  const title = "ASOCIACION PARACENTRAL SALVADOREÑA";
  const subtitle = "PAGO DE SEGUROS";
  const pageWidth = doc.internal.pageSize.getWidth();
  const titleWidth = doc.getTextWidth(title);
  const subtitleWidth = doc.getTextWidth(subtitle);
  const clubNameWidth = doc.getTextWidth(clubName);
  const titleX = (pageWidth - titleWidth) / 2;
  const subtitleX = (pageWidth - subtitleWidth) / 2;
  const clubNameX = (pageWidth - clubNameWidth) / 2;

  doc.text(title, titleX, 10);
  doc.text(subtitle, subtitleX, 20);
  doc.text(clubName, clubNameX, 30);

  const newColumns = columns.map(col => ({ header: col.header, field: col.field }));

  const transformedDataForPdf = data
    .filter(member => !member.seguro)
    .map(member => ({
      ...member,
      seguro: 'pendiente'
    }));

  doc.autoTable({
    head: [newColumns.map(col => col.header)],
    body: transformedDataForPdf.map(member => newColumns.map(col => member[col.field])),
    startY: 40
  });

  const totalAmount = transformedDataForPdf.length * 1.50;
  doc.text(`Total a pagar: $${totalAmount.toFixed(2)}`, 14, doc.autoTable.previous.finalY + 10);

  doc.save(`${clubName}.pdf`);
};
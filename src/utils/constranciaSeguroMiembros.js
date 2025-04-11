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

    // Filtrar los miembros que no tienen seguro
    const transformedDataForPdf = data
      .filter(member => !member.seguro)
      .map(member => ({
        ...member,
        seguro: 'pendiente'
      }));

    // Calcular la cantidad de seguros pendientes y el total a pagar
    const cantidadSeguros = transformedDataForPdf.length;
    const precioPorSeguro = 1.50;
    const totalAmount = cantidadSeguros * precioPorSeguro;

    // Añadir información de resumen antes de la tabla
    doc.setFontSize(12);
    doc.text(`Cantidad de seguros a pagar: ${cantidadSeguros}`, 14, 35);

    doc.autoTable({
      head: [newColumns.map(col => col.header)],
      body: transformedDataForPdf.map(member => newColumns.map(col => member[col.field])),
      startY: 40
    });

    // Añadir totales después de la tabla
    doc.setFont('helvetica', 'bold');
    doc.text(`Total de seguros: ${cantidadSeguros}`, 14, doc.autoTable.previous.finalY + 10);
    doc.text(`Precio por seguro: $${precioPorSeguro.toFixed(2)}`, 14, doc.autoTable.previous.finalY + 15);
    doc.text(`Total a pagar: $${totalAmount.toFixed(2)}`, 14, doc.autoTable.previous.finalY + 20);

    // Añadir fecha de generación
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const fecha = new Date().toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    doc.text(`Fecha de generación: ${fecha}`, 14, doc.autoTable.previous.finalY + 30);

    doc.save(`${clubName}.pdf`);
  };
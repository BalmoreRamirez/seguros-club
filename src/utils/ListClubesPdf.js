import jsPDF from "jspdf";
import "jspdf-autotable";

export const generarPdf = (DataClub, columns) => {
  const doc = new jsPDF();
  const title = "Lista de clubes";
  const pageWidth = doc.internal.pageSize.getWidth();
  const textWidth = doc.getTextWidth(title);
  const x = (pageWidth - textWidth) / 2;

  doc.text(title, x, 10);
  doc.autoTable({
    head: [columns.map(col => col.header)],
    body: DataClub.map(club => columns.map(col => club[col.field])),
  });
  doc.save("lista_de_clubes.pdf");
};
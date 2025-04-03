import jsPDF from "jspdf";
import "jspdf-autotable";
import axiosInstance from "../axiosConfig.js";
import adminServices from "../views/modules/administrator/services/adminServices.js";

export const reporteGeneral = async (toast) => {
    try {
        const response = await adminServices.GeneralReport();
        const data = response.data;

        const doc = new jsPDF();
        const title = "Reporte General de Clubes";
        const pageWidth = doc.internal.pageSize.getWidth();
        const titleWidth = doc.getTextWidth(title);
        const titleX = (pageWidth - titleWidth) / 2;

        doc.text(title, titleX, 10);

        let startY = 20;

        data.forEach((club) => {
            const clubName = `Club: ${club.club}`;
            doc.text(clubName, 14, startY);
            startY += 10;

            const members = club.miembros.map(member => [
                member.primer_nombre,
                member.segundo_nombre,
                member.primer_apellido,
                member.segundo_apellido,
                member.pago_seguro ? 'Pagado' : 'Pendiente'
            ]);

            doc.autoTable({
                head: [['Primer Nombre', 'Segundo Nombre', 'Primer Apellido', 'Segundo Apellido', 'Pago Seguro']],
                body: members,
                startY: startY
            });

            startY = doc.autoTable.previous.finalY + 10;
        });

        doc.save('reporte_general.pdf');
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al generar el reporte general',
            life: 3000
        });
    }
};
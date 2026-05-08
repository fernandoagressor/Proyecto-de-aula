package com.prestafacil.backend.service;

import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.prestafacil.backend.model.Abono;
import com.prestafacil.backend.model.Cliente;
import com.prestafacil.backend.model.Prestamo;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.text.NumberFormat;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Service
public class PdfService {

    public byte[] generarComprobanteAbono(Abono abono) {

        try {
            ByteArrayOutputStream salida = new ByteArrayOutputStream();

            Document documento = new Document(PageSize.A4, 45, 45, 45, 45);
            PdfWriter.getInstance(documento, salida);

            documento.open();

            Font tituloFont = new Font(Font.HELVETICA, 20, Font.BOLD);
            Font subtituloFont = new Font(Font.HELVETICA, 12, Font.NORMAL);
            Font seccionFont = new Font(Font.HELVETICA, 14, Font.BOLD);
            Font normalFont = new Font(Font.HELVETICA, 11, Font.NORMAL);
            Font boldFont = new Font(Font.HELVETICA, 11, Font.BOLD);

            Prestamo prestamo = abono.getPrestamo();
            Cliente cliente = prestamo != null ? prestamo.getCliente() : null;

            Paragraph titulo = new Paragraph("PrestaFácil", tituloFont);
            titulo.setAlignment(Element.ALIGN_CENTER);
            documento.add(titulo);

            Paragraph subtitulo = new Paragraph("Comprobante de abono", subtituloFont);
            subtitulo.setAlignment(Element.ALIGN_CENTER);
            subtitulo.setSpacingAfter(20);
            documento.add(subtitulo);

            Paragraph info = new Paragraph("Información del comprobante", seccionFont);
            info.setSpacingAfter(10);
            documento.add(info);

            PdfPTable tabla = new PdfPTable(2);
            tabla.setWidthPercentage(100);
            tabla.setWidths(new float[]{35, 65});

            agregarFila(tabla, "ID del abono", valorSeguro(abono.getId()), boldFont, normalFont);
            agregarFila(tabla, "Estado del abono", valorSeguro(abono.getEstado()), boldFont, normalFont);
            agregarFila(tabla, "Monto abonado", formatearDinero(abono.getMonto()), boldFont, normalFont);
            agregarFila(tabla, "Fecha", formatearFecha(abono), boldFont, normalFont);

            if (prestamo != null) {
                agregarFila(tabla, "ID préstamo", valorSeguro(prestamo.getId()), boldFont, normalFont);
                agregarFila(tabla, "Monto préstamo", formatearDinero(prestamo.getMonto()), boldFont, normalFont);
                agregarFila(tabla, "Saldo pendiente", formatearDinero(prestamo.getSaldoPendiente()), boldFont, normalFont);
                agregarFila(tabla, "Cuota mensual", formatearDinero(prestamo.getCuotaMensual()), boldFont, normalFont);
                agregarFila(tabla, "Cuotas restantes", valorSeguro(prestamo.getCuotasRestantes()), boldFont, normalFont);
                agregarFila(tabla, "Estado préstamo", valorSeguro(prestamo.getEstado()), boldFont, normalFont);
            }

            documento.add(tabla);

            documento.add(new Paragraph(" "));

            Paragraph infoCliente = new Paragraph("Información del cliente", seccionFont);
            infoCliente.setSpacingBefore(12);
            infoCliente.setSpacingAfter(10);
            documento.add(infoCliente);

            PdfPTable tablaCliente = new PdfPTable(2);
            tablaCliente.setWidthPercentage(100);
            tablaCliente.setWidths(new float[]{35, 65});

            if (cliente != null) {
                agregarFila(tablaCliente, "Nombre", valorSeguro(cliente.getNombre()), boldFont, normalFont);
                agregarFila(tablaCliente, "Cédula", valorSeguro(cliente.getCedula()), boldFont, normalFont);
                agregarFila(tablaCliente, "Teléfono", valorSeguro(cliente.getTelefono()), boldFont, normalFont);
                agregarFila(tablaCliente, "Dirección", valorSeguro(cliente.getDireccion()), boldFont, normalFont);
            } else {
                agregarFila(tablaCliente, "Cliente", "No asociado", boldFont, normalFont);
            }

            documento.add(tablaCliente);

            Paragraph nota = new Paragraph(
                    "\nEste documento es un comprobante generado automáticamente por el sistema PrestaFácil.",
                    normalFont
            );
            nota.setSpacingBefore(18);
            nota.setAlignment(Element.ALIGN_CENTER);
            documento.add(nota);

            Paragraph footer = new Paragraph(
                    "Gracias por usar PrestaFácil.",
                    boldFont
            );
            footer.setAlignment(Element.ALIGN_CENTER);
            footer.setSpacingBefore(8);
            documento.add(footer);

            documento.close();

            return salida.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Error generando comprobante PDF", e);
        }
    }

    private void agregarFila(
            PdfPTable tabla,
            String etiqueta,
            String valor,
            Font etiquetaFont,
            Font valorFont
    ) {
        PdfPCell celdaEtiqueta = new PdfPCell(new Phrase(etiqueta, etiquetaFont));
        celdaEtiqueta.setPadding(9);
        celdaEtiqueta.setBorder(Rectangle.BOX);
        celdaEtiqueta.setBackgroundColor(new java.awt.Color(239, 246, 255));

        PdfPCell celdaValor = new PdfPCell(new Phrase(valor, valorFont));
        celdaValor.setPadding(9);
        celdaValor.setBorder(Rectangle.BOX);

        tabla.addCell(celdaEtiqueta);
        tabla.addCell(celdaValor);
    }

    private String formatearDinero(Double valor) {
        if (valor == null) {
            valor = 0.0;
        }

        NumberFormat formato = NumberFormat.getCurrencyInstance(new Locale("es", "CO"));
        return formato.format(valor);
    }

    private String formatearFecha(Abono abono) {
        if (abono.getFecha() == null) {
            return "No registra";
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        return abono.getFecha().format(formatter);
    }

    private String valorSeguro(Object valor) {
        if (valor == null) {
            return "No registra";
        }

        return String.valueOf(valor);
    }
}
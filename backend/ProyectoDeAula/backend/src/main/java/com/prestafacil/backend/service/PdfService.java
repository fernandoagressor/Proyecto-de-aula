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

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.text.NumberFormat;
import java.time.LocalDateTime;
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

            Font marcaFont = new Font(Font.HELVETICA, 22, Font.BOLD, new Color(6, 71, 173));
            Font tituloFont = new Font(Font.HELVETICA, 17, Font.BOLD, Color.BLACK);
            Font subtituloFont = new Font(Font.HELVETICA, 11, Font.NORMAL, new Color(90, 101, 120));
            Font seccionFont = new Font(Font.HELVETICA, 13, Font.BOLD, new Color(15, 23, 42));
            Font normalFont = new Font(Font.HELVETICA, 10, Font.NORMAL, new Color(51, 65, 85));
            Font boldFont = new Font(Font.HELVETICA, 10, Font.BOLD, new Color(15, 23, 42));
            Font whiteBoldFont = new Font(Font.HELVETICA, 10, Font.BOLD, Color.WHITE);
            Font estadoFont = new Font(Font.HELVETICA, 13, Font.BOLD, new Color(22, 101, 52));

            Prestamo prestamo = abono.getPrestamo();
            Cliente cliente = prestamo != null ? prestamo.getCliente() : null;

            agregarEncabezado(documento, marcaFont, tituloFont, subtituloFont);
            agregarResumenPago(documento, abono, prestamo, estadoFont, boldFont, normalFont, whiteBoldFont);
            agregarDatosCliente(documento, cliente, seccionFont, boldFont, normalFont);
            agregarDatosPrestamo(documento, prestamo, seccionFont, boldFont, normalFont);
            agregarDatosTransaccion(documento, abono, seccionFont, boldFont, normalFont);
            agregarNotaFinal(documento, normalFont, boldFont);

            documento.close();

            return salida.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Error generando comprobante PDF", e);
        }
    }

    private void agregarEncabezado(
            Document documento,
            Font marcaFont,
            Font tituloFont,
            Font subtituloFont
    ) throws Exception {

        Paragraph marca = new Paragraph("PrestaFacil", marcaFont);
        marca.setAlignment(Element.ALIGN_CENTER);
        marca.setSpacingAfter(4);
        documento.add(marca);

        Paragraph titulo = new Paragraph("Comprobante de pago", tituloFont);
        titulo.setAlignment(Element.ALIGN_CENTER);
        titulo.setSpacingAfter(4);
        documento.add(titulo);

        Paragraph subtitulo = new Paragraph(
                "Documento generado automaticamente por el sistema de prestamos.",
                subtituloFont
        );
        subtitulo.setAlignment(Element.ALIGN_CENTER);
        subtitulo.setSpacingAfter(18);
        documento.add(subtitulo);
    }

    private void agregarResumenPago(
            Document documento,
            Abono abono,
            Prestamo prestamo,
            Font estadoFont,
            Font boldFont,
            Font normalFont,
            Font whiteBoldFont
    ) throws Exception {

        PdfPTable caja = new PdfPTable(2);
        caja.setWidthPercentage(100);
        caja.setWidths(new float[]{50, 50});
        caja.setSpacingAfter(18);

        PdfPCell celdaEstado = new PdfPCell();
        celdaEstado.setPadding(14);
        celdaEstado.setBorder(Rectangle.NO_BORDER);
        celdaEstado.setBackgroundColor(new Color(220, 252, 231));

        Paragraph estadoLabel = new Paragraph("Estado del pago", normalFont);
        estadoLabel.setSpacingAfter(5);
        celdaEstado.addElement(estadoLabel);

        Paragraph estado = new Paragraph(valorSeguro(abono.getEstado()), estadoFont);
        celdaEstado.addElement(estado);

        PdfPCell celdaMonto = new PdfPCell();
        celdaMonto.setPadding(14);
        celdaMonto.setBorder(Rectangle.NO_BORDER);
        celdaMonto.setBackgroundColor(new Color(239, 246, 255));

        Paragraph montoLabel = new Paragraph("Monto pagado", normalFont);
        montoLabel.setSpacingAfter(5);
        celdaMonto.addElement(montoLabel);

        Paragraph monto = new Paragraph(formatearDinero(abono.getMonto()), boldFont);
        celdaMonto.addElement(monto);

        caja.addCell(celdaEstado);
        caja.addCell(celdaMonto);

        documento.add(caja);

        PdfPTable banda = new PdfPTable(3);
        banda.setWidthPercentage(100);
        banda.setWidths(new float[]{33, 34, 33});
        banda.setSpacingAfter(20);

        agregarCeldaBanda(banda, "Metodo", valorSeguro(abono.getMetodoPago()), whiteBoldFont);
        agregarCeldaBanda(banda, "Referencia", valorSeguro(abono.getReferenciaPago()), whiteBoldFont);
        agregarCeldaBanda(
                banda,
                "Saldo actual",
                prestamo != null ? formatearDinero(prestamo.getSaldoPendiente()) : "No registra",
                whiteBoldFont
        );

        documento.add(banda);
    }

    private void agregarDatosCliente(
            Document documento,
            Cliente cliente,
            Font seccionFont,
            Font boldFont,
            Font normalFont
    ) throws Exception {

        agregarTituloSeccion(documento, "Informacion del cliente", seccionFont);

        PdfPTable tabla = crearTabla();

        if (cliente != null) {
            agregarFila(tabla, "Nombre", valorSeguro(cliente.getNombre()), boldFont, normalFont);
            agregarFila(tabla, "Cedula", valorSeguro(cliente.getCedula()), boldFont, normalFont);
            agregarFila(tabla, "Telefono", valorSeguro(cliente.getTelefono()), boldFont, normalFont);
            agregarFila(tabla, "Direccion", valorSeguro(cliente.getDireccion()), boldFont, normalFont);
        } else {
            agregarFila(tabla, "Cliente", "No asociado", boldFont, normalFont);
        }

        documento.add(tabla);
    }

    private void agregarDatosPrestamo(
            Document documento,
            Prestamo prestamo,
            Font seccionFont,
            Font boldFont,
            Font normalFont
    ) throws Exception {

        agregarTituloSeccion(documento, "Informacion del prestamo", seccionFont);

        PdfPTable tabla = crearTabla();

        if (prestamo != null) {
            agregarFila(tabla, "ID prestamo", valorSeguro(prestamo.getId()), boldFont, normalFont);
            agregarFila(tabla, "Monto original", formatearDinero(prestamo.getMonto()), boldFont, normalFont);
            agregarFila(tabla, "Interes", formatearPorcentaje(prestamo.getInteres()), boldFont, normalFont);
            agregarFila(tabla, "Cuota mensual", formatearDinero(prestamo.getCuotaMensual()), boldFont, normalFont);
            agregarFila(tabla, "Cuotas restantes", valorSeguro(prestamo.getCuotasRestantes()), boldFont, normalFont);
            agregarFila(tabla, "Saldo pendiente", formatearDinero(prestamo.getSaldoPendiente()), boldFont, normalFont);
            agregarFila(tabla, "Estado prestamo", valorSeguro(prestamo.getEstado()), boldFont, normalFont);
        } else {
            agregarFila(tabla, "Prestamo", "No asociado", boldFont, normalFont);
        }

        documento.add(tabla);
    }

    private void agregarDatosTransaccion(
            Document documento,
            Abono abono,
            Font seccionFont,
            Font boldFont,
            Font normalFont
    ) throws Exception {

        agregarTituloSeccion(documento, "Informacion de la transaccion", seccionFont);

        PdfPTable tabla = crearTabla();

        agregarFila(tabla, "ID abono", valorSeguro(abono.getId()), boldFont, normalFont);
        agregarFila(tabla, "Monto", formatearDinero(abono.getMonto()), boldFont, normalFont);
        agregarFila(tabla, "Estado", valorSeguro(abono.getEstado()), boldFont, normalFont);
        agregarFila(tabla, "Metodo de pago", valorSeguro(abono.getMetodoPago()), boldFont, normalFont);
        agregarFila(tabla, "Referencia PSE", valorSeguro(abono.getReferenciaPago()), boldFont, normalFont);
        agregarFila(tabla, "Fecha de pago", formatearFecha(abono.getFecha()), boldFont, normalFont);
        agregarFila(tabla, "Fecha de aprobacion", formatearFecha(abono.getFechaAprobacion()), boldFont, normalFont);
        agregarFila(tabla, "Observacion", valorSeguro(abono.getObservacion()), boldFont, normalFont);

        documento.add(tabla);
    }

    private void agregarNotaFinal(
            Document documento,
            Font normalFont,
            Font boldFont
    ) throws Exception {

        Paragraph nota = new Paragraph(
                "\nEste comprobante certifica que el pago fue registrado en el sistema PrestaFacil. " +
                        "Para efectos academicos, la pasarela PSE corresponde a una simulacion controlada.",
                normalFont
        );
        nota.setSpacingBefore(18);
        nota.setAlignment(Element.ALIGN_CENTER);
        documento.add(nota);

        Paragraph footer = new Paragraph("Gracias por usar PrestaFacil.", boldFont);
        footer.setAlignment(Element.ALIGN_CENTER);
        footer.setSpacingBefore(8);
        documento.add(footer);
    }

    private PdfPTable crearTabla() throws Exception {
        PdfPTable tabla = new PdfPTable(2);
        tabla.setWidthPercentage(100);
        tabla.setWidths(new float[]{35, 65});
        tabla.setSpacingAfter(15);
        return tabla;
    }

    private void agregarTituloSeccion(
            Document documento,
            String texto,
            Font seccionFont
    ) throws Exception {

        Paragraph titulo = new Paragraph(texto, seccionFont);
        titulo.setSpacingBefore(8);
        titulo.setSpacingAfter(8);
        documento.add(titulo);
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
        celdaEtiqueta.setBackgroundColor(new Color(239, 246, 255));

        PdfPCell celdaValor = new PdfPCell(new Phrase(valor, valorFont));
        celdaValor.setPadding(9);
        celdaValor.setBorder(Rectangle.BOX);
        celdaValor.setBackgroundColor(Color.WHITE);

        tabla.addCell(celdaEtiqueta);
        tabla.addCell(celdaValor);
    }

    private void agregarCeldaBanda(
            PdfPTable tabla,
            String etiqueta,
            String valor,
            Font font
    ) {
        PdfPCell celda = new PdfPCell();
        celda.setBorder(Rectangle.NO_BORDER);
        celda.setPadding(12);
        celda.setBackgroundColor(new Color(6, 71, 173));

        Paragraph label = new Paragraph(etiqueta, font);
        label.setAlignment(Element.ALIGN_CENTER);
        label.setSpacingAfter(4);
        celda.addElement(label);

        Paragraph value = new Paragraph(valor, font);
        value.setAlignment(Element.ALIGN_CENTER);
        celda.addElement(value);

        tabla.addCell(celda);
    }

    private String formatearDinero(Double valor) {
        if (valor == null) {
            valor = 0.0;
        }

        NumberFormat formato = NumberFormat.getCurrencyInstance(new Locale("es", "CO"));
        return formato.format(valor);
    }

    private String formatearPorcentaje(Double valor) {
        if (valor == null) {
            return "0%";
        }

        return (valor * 100) + "%";
    }

    private String formatearFecha(LocalDateTime fecha) {
        if (fecha == null) {
            return "No registra";
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
        return fecha.format(formatter);
    }

    private String valorSeguro(Object valor) {
        if (valor == null) {
            return "No registra";
        }

        String texto = String.valueOf(valor);

        if (texto.trim().isEmpty()) {
            return "No registra";
        }

        return texto;
    }
}
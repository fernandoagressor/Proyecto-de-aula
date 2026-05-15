package com.prestafacil.backend.controller;

import com.prestafacil.backend.model.Abono;
import com.prestafacil.backend.model.Cliente;
import com.prestafacil.backend.model.Prestamo;
import com.prestafacil.backend.service.AbonoService;
import com.prestafacil.backend.service.PdfService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/abonos")
@CrossOrigin(origins = "http://localhost:4200")
public class AbonoController {

    private final AbonoService abonoService;
    private final PdfService pdfService;

    public AbonoController(
            AbonoService abonoService,
            PdfService pdfService
    ) {
        this.abonoService = abonoService;
        this.pdfService = pdfService;
    }

    @GetMapping
    public List<Map<String, Object>> listarAbonos() {
        return abonoService.listarAbonos()
                .stream()
                .map(this::convertirAbonoARespuesta)
                .collect(Collectors.toList());
    }
    @GetMapping("/pendientes/clientes")
    public List<Map<String, Object>> listarPendientesClientes() {
        return abonoService.listarAbonosPendientesClientes()
                .stream()
                .map(this::convertirAbonoARespuesta)
                .collect(Collectors.toList());
    }

    @GetMapping("/pendientes/empresa/{empresaId}")
    public List<Map<String, Object>> listarPendientesEmpresa(
            @PathVariable Long empresaId
    ) {
        return abonoService.listarAbonosPendientesEmpleadosPorEmpresa(empresaId)
                .stream()
                .map(this::convertirAbonoARespuesta)
                .collect(Collectors.toList());
    }

    @GetMapping("/prestamo/{prestamoId}")
    public List<Map<String, Object>> listarAbonosPorPrestamo(@PathVariable Long prestamoId) {
        return abonoService.listarAbonosPorPrestamo(prestamoId)
                .stream()
                .map(this::convertirAbonoARespuesta)
                .collect(Collectors.toList());
    }

    @GetMapping("/pendientes")
    public List<Map<String, Object>> listarPendientes() {
        return abonoService.listarAbonosPendientes()
                .stream()
                .map(this::convertirAbonoARespuesta)
                .collect(Collectors.toList());
    }

    @GetMapping("/{abonoId}/comprobante")
    public ResponseEntity<byte[]> descargarComprobanteAbono(@PathVariable Long abonoId) {

        Abono abono = abonoService.buscarAbonoPorId(abonoId);

        byte[] pdf = pdfService.generarComprobanteAbono(abono);

        String nombreArchivo = "comprobante-abono-" + abonoId + ".pdf";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + nombreArchivo)
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    private Map<String, Object> convertirAbonoARespuesta(Abono abono) {

        Map<String, Object> respuesta = new HashMap<>();

        respuesta.put("id", abono.getId());
        respuesta.put("monto", abono.getMonto());
        respuesta.put("fecha", abono.getFecha());
        respuesta.put("estado", abono.getEstado());

        Prestamo prestamo = abono.getPrestamo();

        if (prestamo != null) {

            Map<String, Object> prestamoMap = new HashMap<>();

            prestamoMap.put("id", prestamo.getId());
            prestamoMap.put("monto", prestamo.getMonto());
            prestamoMap.put("plazoMeses", prestamo.getPlazoMeses());
            prestamoMap.put("empleadoNombre", prestamo.getEmpleadoNombre());
            prestamoMap.put("empleadoCedula", prestamo.getEmpleadoCedula());
            prestamoMap.put("empleadoCargo", prestamo.getEmpleadoCargo());
            prestamoMap.put("empresaId", prestamo.getEmpresaId());
            prestamoMap.put("interes", prestamo.getInteres());
            prestamoMap.put("saldoPendiente", prestamo.getSaldoPendiente());
            prestamoMap.put("cuotaMensual", prestamo.getCuotaMensual());
            prestamoMap.put("cuotasRestantes", prestamo.getCuotasRestantes());
            prestamoMap.put("estado", prestamo.getEstado());

            Cliente cliente = prestamo.getCliente();

            if (cliente != null) {

                Map<String, Object> clienteMap = new HashMap<>();

                clienteMap.put("id", cliente.getId());
                clienteMap.put("nombre", cliente.getNombre());
                clienteMap.put("cedula", cliente.getCedula());
                clienteMap.put("telefono", cliente.getTelefono());
                clienteMap.put("direccion", cliente.getDireccion());

                prestamoMap.put("cliente", clienteMap);

            } else {
                prestamoMap.put("cliente", null);
            }

            respuesta.put("prestamo", prestamoMap);

        } else {
            respuesta.put("prestamo", null);
        }

        return respuesta;
    }
}
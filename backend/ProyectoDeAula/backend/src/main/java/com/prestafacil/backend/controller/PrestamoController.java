package com.prestafacil.backend.controller;

import com.prestafacil.backend.model.Abono;
import com.prestafacil.backend.model.Prestamo;
import com.prestafacil.backend.service.PrestamoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/prestamos")
@CrossOrigin(origins = "http://localhost:4200")
public class PrestamoController {

    private final PrestamoService prestamoService;

    public PrestamoController(PrestamoService prestamoService) {
        this.prestamoService = prestamoService;
    }

    @GetMapping
    public List<Prestamo> listar() {
        return prestamoService.listarPrestamos();
    }

    @GetMapping("/cliente/{clienteId}")
    public List<Prestamo> listarPorCliente(@PathVariable Long clienteId) {
        return prestamoService.listarPrestamosPorCliente(clienteId);
    }

    @GetMapping("/{id}")
    public Prestamo obtenerPorId(@PathVariable Long id) {
        return prestamoService.obtenerPorId(id);
    }

    @PostMapping("/solicitar")
    public Prestamo solicitar(@RequestBody Map<String, String> datos) {
        Long clienteId = Long.parseLong(datos.get("clienteId"));
        Double monto = Double.parseDouble(datos.get("monto"));
        Integer plazoMeses = Integer.parseInt(datos.get("plazoMeses"));

        return prestamoService.solicitarPrestamo(clienteId, monto, plazoMeses);
    }

    @PutMapping("/{id}/aprobar")
    public Prestamo aprobar(@PathVariable Long id) {
        return prestamoService.aprobarPrestamo(id);
    }

    @PutMapping("/{id}/rechazar")
    public Prestamo rechazar(@PathVariable Long id) {
        return prestamoService.rechazarPrestamo(id);
    }

    @PutMapping("/{id}/abonar")
    public Abono abonar(@PathVariable Long id, @RequestBody Map<String, Double> body) {
        return prestamoService.abonarPrestamo(id, body.get("abono"));
    }

    @PutMapping("/abonos/{abonoId}/aprobar")
    public Abono aprobarAbono(@PathVariable Long abonoId) {
        return prestamoService.aprobarAbono(abonoId);
    }

    @PutMapping("/abonos/{abonoId}/rechazar")
    public Abono rechazarAbono(@PathVariable Long abonoId) {
        return prestamoService.rechazarAbono(abonoId);
    }
}
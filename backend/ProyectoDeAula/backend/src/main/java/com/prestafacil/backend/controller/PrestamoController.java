package com.prestafacil.backend.controller;

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
    public List<Prestamo> listarPrestamos() {
        return prestamoService.listarPrestamos();
    }
    @GetMapping("/cliente/{clienteId}")
    public List<Prestamo> listarPrestamosPorCliente(@PathVariable Long clienteId) {
        return prestamoService.listarPrestamosPorCliente(clienteId);
    }
    @PostMapping("/solicitar")
    public Prestamo solicitarPrestamo(@RequestBody Map<String, String> datos) {
        Long clienteId = Long.parseLong(datos.get("clienteId"));
        Double monto = Double.parseDouble(datos.get("monto"));
        Integer plazoMeses = Integer.parseInt(datos.get("plazoMeses"));
        Double interes = Double.parseDouble(datos.get("interes"));
        return  prestamoService.solicitarPrestamo(clienteId, monto, plazoMeses, interes);
    }
    @PutMapping("/{id}/aprobar")
    public Prestamo aprobarPrestamo(@PathVariable Long id) {
        return prestamoService.aprobarPrestamo(id);
    }
    @PutMapping("/{id}/rechazar")
    public Prestamo rechazarPrestamo(@PathVariable Long id) {
        return prestamoService.rechazarPrestamo(id);
    }
    @PutMapping("/{id}/abonar")
    public Prestamo abonar(@PathVariable Long id, @RequestBody Map<String, String> datos) {
        Double abono = Double.parseDouble(datos.get("abono"));
        return prestamoService.abonarPrestamo(id, abono);
    }
    @GetMapping("/{id}")
    public Prestamo obtenerPrestamoPorId(@PathVariable Long id) {
        return prestamoService.obtenerPorId(id);
    }

}

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
    public List<Prestamo> listarPrestamos() {
        return prestamoService.listarPrestamos();
    }

    // ADMIN → SOLO PRÉSTAMOS DE CLIENTES
    @GetMapping("/clientes")
    public List<Prestamo> listarPrestamosClientes() {
        return prestamoService.listarPrestamosClientes();
    }

    @GetMapping("/cliente/{clienteId}")
    public List<Prestamo> listarPorCliente(@PathVariable Long clienteId) {
        return prestamoService.listarPrestamosPorCliente(clienteId);
    }

    @GetMapping("/empleado/{empleadoId}")
    public List<Prestamo> listarPorEmpleado(@PathVariable Long empleadoId) {
        return prestamoService.listarPrestamosPorEmpleado(empleadoId);
    }

    @GetMapping("/empresa/{empresaId}")
    public List<Prestamo> listarPorEmpresa(@PathVariable Long empresaId) {
        return prestamoService.listarPrestamosPorEmpresa(empresaId);
    }

    // EMPRESA → SOLO PRÉSTAMOS DE EMPLEADOS
    @GetMapping("/empresa/{empresaId}/empleados")
    public List<Prestamo> listarPrestamosEmpleadosPorEmpresa(
            @PathVariable Long empresaId
    ) {
        return prestamoService.listarPrestamosEmpleadosPorEmpresa(empresaId);
    }

    @GetMapping("/{id}")
    public Prestamo obtenerPorId(@PathVariable Long id) {
        return prestamoService.obtenerPorId(id);
    }

    @PostMapping("/solicitar")
    public Prestamo solicitarPrestamo(@RequestBody Map<String, Object> body) {
        Long clienteId = Long.valueOf(body.get("clienteId").toString());
        Double monto = Double.valueOf(body.get("monto").toString());
        Integer plazoMeses = Integer.valueOf(body.get("plazoMeses").toString());

        return prestamoService.solicitarPrestamo(clienteId, monto, plazoMeses);
    }

    @PostMapping("/solicitar-empleado")
    public Prestamo solicitarPrestamoEmpleado(@RequestBody Map<String, Object> body) {
        Long empleadoId = Long.valueOf(body.get("empleadoId").toString());
        Long empresaId = Long.valueOf(body.get("empresaId").toString());
        Double monto = Double.valueOf(body.get("monto").toString());
        Integer plazoMeses = Integer.valueOf(body.get("plazoMeses").toString());

        return prestamoService.solicitarPrestamoEmpleado(
                empleadoId,
                empresaId,
                monto,
                plazoMeses
        );
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
    public Abono abonarPrestamo(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body
    ) {
        Double montoAbono = Double.valueOf(body.get("abono").toString());
        return prestamoService.abonarPrestamo(id, montoAbono);
    }

    @PostMapping("/{id}/pagar-pse")
    public Map<String, Object> pagarPorPse(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body
    ) {
        Double montoPago = Double.valueOf(body.get("monto").toString());
        return prestamoService.pagarPorPse(id, montoPago);
    }
}
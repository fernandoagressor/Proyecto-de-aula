package com.prestafacil.backend.controller;

import com.prestafacil.backend.model.PrestamoEmpleado;
import com.prestafacil.backend.service.PrestamoEmpleadoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prestamos-empleados")
@CrossOrigin(origins = "http://localhost:4200")
public class PrestamoEmpleadoController {

    private final PrestamoEmpleadoService prestamoEmpleadoService;

    public PrestamoEmpleadoController(PrestamoEmpleadoService prestamoEmpleadoService) {
        this.prestamoEmpleadoService = prestamoEmpleadoService;
    }

    @GetMapping
    public List<PrestamoEmpleado> listar() {
        return prestamoEmpleadoService.listar();
    }

    @PostMapping
    public PrestamoEmpleado crear(@RequestBody PrestamoEmpleado prestamoEmpleado) {
        return prestamoEmpleadoService.crear(prestamoEmpleado);
    }

    @PutMapping("/{id}")
    public PrestamoEmpleado actualizar(
            @PathVariable Long id,
            @RequestBody PrestamoEmpleado prestamoEmpleado
    ) {
        return prestamoEmpleadoService.actualizar(id, prestamoEmpleado);
    }

    @PutMapping("/{id}/aprobar")
    public PrestamoEmpleado aprobar(@PathVariable Long id) {
        return prestamoEmpleadoService.aprobar(id);
    }

    @PutMapping("/{id}/rechazar")
    public PrestamoEmpleado rechazar(@PathVariable Long id) {
        return prestamoEmpleadoService.rechazar(id);
    }

    @PutMapping("/{id}/pagado")
    public PrestamoEmpleado marcarPagado(@PathVariable Long id) {
        return prestamoEmpleadoService.marcarPagado(id);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        prestamoEmpleadoService.eliminar(id);
    }
}
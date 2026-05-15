package com.prestafacil.backend.controller;

import com.prestafacil.backend.model.EmpleadoEmpresa;
import com.prestafacil.backend.service.EmpleadoEmpresaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/empleados-empresa")
@CrossOrigin(origins = "http://localhost:4200")
public class EmpleadoEmpresaController {

    private final EmpleadoEmpresaService empleadoEmpresaService;

    public EmpleadoEmpresaController(EmpleadoEmpresaService empleadoEmpresaService) {
        this.empleadoEmpresaService = empleadoEmpresaService;
    }

    @GetMapping("/empresa/{empresaId}")
    public List<EmpleadoEmpresa> listarPorEmpresa(@PathVariable Long empresaId) {
        return empleadoEmpresaService.listarPorEmpresa(empresaId);
    }

    @PostMapping
    public EmpleadoEmpresa crear(@RequestBody EmpleadoEmpresa empleado) {
        return empleadoEmpresaService.crear(empleado);
    }

    @PutMapping("/{id}")
    public EmpleadoEmpresa actualizar(
            @PathVariable Long id,
            @RequestBody EmpleadoEmpresa empleado
    ) {
        return empleadoEmpresaService.actualizar(id, empleado);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        empleadoEmpresaService.eliminar(id);
    }
}
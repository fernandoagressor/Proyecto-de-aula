package com.prestafacil.backend.controller;

import com.prestafacil.backend.model.Abono;
import com.prestafacil.backend.service.AbonoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/abonos")
@CrossOrigin(origins = "http://localhost:4200")
public class AbonoController {

    private final AbonoService abonoService;

    public AbonoController(AbonoService abonoService) {
        this.abonoService = abonoService;
    }

    @GetMapping
    public List<Abono> listarAbonos() {
        return abonoService.listarAbonos();
    }

    @GetMapping("/prestamo/{prestamoId}")
    public List<Abono> listarAbonosPorPrestamo(@PathVariable Long prestamoId) {
        return abonoService.listarAbonosPorPrestamo(prestamoId);
    }

    @GetMapping("/pendientes")
    public List<Abono> listarPendientes() {
        return abonoService.listarAbonosPendientes();
    }
}
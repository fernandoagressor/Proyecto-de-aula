package com.prestafacil.backend.controller;

import com.prestafacil.backend.model.ConfiguracionSistema;
import com.prestafacil.backend.service.ConfiguracionSistemaService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/configuracion")
@CrossOrigin(origins = "http://localhost:4200")
public class ConfiguracionSistemaController {

    private final ConfiguracionSistemaService configuracionSistemaService;

    public ConfiguracionSistemaController(ConfiguracionSistemaService configuracionSistemaService) {
        this.configuracionSistemaService = configuracionSistemaService;
    }

    @GetMapping
    public ConfiguracionSistema obtenerConfiguracion() {
        return configuracionSistemaService.obtenerConfiguracion();
    }

    @PutMapping("/tasa")
    public ConfiguracionSistema actualizarTasa(@RequestBody Map<String, String> datos) {
        Double tasaInteres = Double.parseDouble(datos.get("tasaInteres"));
        return configuracionSistemaService.actualizarTasa(tasaInteres);
    }
}
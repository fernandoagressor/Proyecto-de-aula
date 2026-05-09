package com.prestafacil.backend.controller;

import com.prestafacil.backend.model.Notificacion;
import com.prestafacil.backend.service.NotificacionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notificaciones")
@CrossOrigin(origins = "http://localhost:4200")
public class NotificacionController {

    private final NotificacionService notificacionService;

    public NotificacionController(NotificacionService notificacionService) {
        this.notificacionService = notificacionService;
    }

    @GetMapping("/rol/{rol}")
    public List<Notificacion> listarPorRol(@PathVariable String rol) {
        return notificacionService.listarPorRol(rol);
    }

    @GetMapping("/rol/{rol}/no-leidas")
    public Map<String, Object> contarNoLeidas(@PathVariable String rol) {
        Long total = notificacionService.contarNoLeidasPorRol(rol);

        return Map.of(
                "total", total
        );
    }

    @PutMapping("/rol/{rol}/marcar-leidas")
    public Map<String, Object> marcarComoLeidas(@PathVariable String rol) {
        notificacionService.marcarComoLeidasPorRol(rol);

        return Map.of(
                "ok", true,
                "mensaje", "Notificaciones marcadas como leídas."
        );
    }
}
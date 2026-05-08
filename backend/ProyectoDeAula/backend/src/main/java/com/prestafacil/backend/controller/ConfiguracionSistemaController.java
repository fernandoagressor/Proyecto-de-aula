package com.prestafacil.backend.controller;

import com.prestafacil.backend.model.ConfiguracionSistema;
import com.prestafacil.backend.service.ConfiguracionSistemaService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/configuracion")
@CrossOrigin(origins = "http://localhost:4200")
public class ConfiguracionSistemaController {

    private final ConfiguracionSistemaService configuracionSistemaService;

    public ConfiguracionSistemaController(ConfiguracionSistemaService configuracionSistemaService) {
        this.configuracionSistemaService = configuracionSistemaService;
    }

    // =============================
    // OBTENER CONFIGURACIÓN COMPLETA
    // =============================

    @GetMapping
    public ResponseEntity<ConfiguracionSistema> obtenerConfiguracion() {
        ConfiguracionSistema configuracion = configuracionSistemaService.obtenerConfiguracion();
        return ResponseEntity.ok(configuracion);
    }

    // =============================
    // OBTENER SOLO LA TASA
    // =============================

    @GetMapping("/tasa")
    public ResponseEntity<Map<String, Object>> obtenerTasa() {
        ConfiguracionSistema configuracion = configuracionSistemaService.obtenerConfiguracion();

        Double tasaDecimal = configuracion.getTasaInteres();
        Double tasaPorcentaje = tasaDecimal * 100;

        Map<String, Object> respuesta = new LinkedHashMap<>();
        respuesta.put("ok", true);
        respuesta.put("tasaDecimal", tasaDecimal);
        respuesta.put("tasaPorcentaje", tasaPorcentaje);
        respuesta.put("fechaActualizacion", configuracion.getFechaActualizacion());

        return ResponseEntity.ok(respuesta);
    }

    // =============================
    // ACTUALIZAR TASA
    // =============================

    @PutMapping("/tasa")
    public ResponseEntity<?> actualizarTasa(@RequestBody Map<String, Object> datos) {
        try {
            Double tasaIngresada = convertirDouble(datos.get("tasaInteres"), "tasaInteres");

            /*
             * El frontend puede enviar:
             * 5    → representa 5%
             * 0.05 → representa 5%
             *
             * Si el valor es mayor que 1, lo convertimos a decimal.
             */
            Double tasaDecimal = normalizarTasa(tasaIngresada);

            ConfiguracionSistema configuracionActualizada =
                    configuracionSistemaService.actualizarTasa(tasaDecimal);

            Map<String, Object> respuesta = new LinkedHashMap<>();
            respuesta.put("ok", true);
            respuesta.put("mensaje", "Tasa actualizada correctamente.");
            respuesta.put("configuracion", configuracionActualizada);
            respuesta.put("tasaDecimal", configuracionActualizada.getTasaInteres());
            respuesta.put("tasaPorcentaje", configuracionActualizada.getTasaInteres() * 100);

            return ResponseEntity.ok(respuesta);

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(respuestaError(e.getMessage()));

        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(respuestaError(e.getMessage()));
        }
    }

    // =============================
    // MÉTODOS AUXILIARES
    // =============================

    private Double convertirDouble(Object valor, String campo) {
        if (valor == null || valor.toString().trim().isEmpty()) {
            throw new IllegalArgumentException("El campo " + campo + " es obligatorio.");
        }

        try {
            return Double.parseDouble(valor.toString());
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("El campo " + campo + " debe ser un número válido.");
        }
    }

    private Double normalizarTasa(Double tasa) {
        if (tasa == null) {
            throw new IllegalArgumentException("La tasa de interés es obligatoria.");
        }

        if (tasa < 0) {
            throw new IllegalArgumentException("La tasa de interés no puede ser negativa.");
        }

        /*
         * Si el usuario manda 5, se guarda 0.05.
         * Si manda 0.05, se deja 0.05.
         */
        if (tasa > 1) {
            tasa = tasa / 100;
        }

        /*
         * Límite de seguridad:
         * no permitir tasas mayores al 100%.
         */
        if (tasa > 1) {
            throw new IllegalArgumentException("La tasa de interés no puede superar el 100%.");
        }

        return tasa;
    }

    private Map<String, Object> respuestaError(String mensaje) {
        Map<String, Object> respuesta = new LinkedHashMap<>();
        respuesta.put("ok", false);
        respuesta.put("mensaje", mensaje);
        return respuesta;
    }
}
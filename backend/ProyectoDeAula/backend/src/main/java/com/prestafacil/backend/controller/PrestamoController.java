package com.prestafacil.backend.controller;

import com.prestafacil.backend.model.Abono;
import com.prestafacil.backend.model.Prestamo;
import com.prestafacil.backend.service.PrestamoService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
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
    public ResponseEntity<List<Prestamo>> listar() {
        List<Prestamo> prestamos = prestamoService.listarPrestamos();
        return ResponseEntity.ok(prestamos);
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<?> listarPorCliente(@PathVariable Long clienteId) {
        try {
            List<Prestamo> prestamos = prestamoService.listarPrestamosPorCliente(clienteId);
            return ResponseEntity.ok(prestamos);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(respuestaError(e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        try {
            Prestamo prestamo = prestamoService.obtenerPorId(id);
            return ResponseEntity.ok(prestamo);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(respuestaError(e.getMessage()));
        }
    }

    @PostMapping("/solicitar")
    public ResponseEntity<?> solicitar(@RequestBody Map<String, Object> datos) {
        try {
            Long clienteId = convertirLong(datos.get("clienteId"), "clienteId");
            Double monto = convertirDouble(datos.get("monto"), "monto");
            Integer plazoMeses = convertirInteger(datos.get("plazoMeses"), "plazoMeses");

            Prestamo prestamo = prestamoService.solicitarPrestamo(clienteId, monto, plazoMeses);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(prestamo);

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

    @PutMapping("/{id}/aprobar")
    public ResponseEntity<?> aprobar(@PathVariable Long id) {
        try {
            Prestamo prestamo = prestamoService.aprobarPrestamo(id);
            return ResponseEntity.ok(prestamo);

        } catch (IllegalStateException e) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(respuestaError(e.getMessage()));

        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(respuestaError(e.getMessage()));
        }
    }

    @PutMapping("/{id}/rechazar")
    public ResponseEntity<?> rechazar(@PathVariable Long id) {
        try {
            Prestamo prestamo = prestamoService.rechazarPrestamo(id);
            return ResponseEntity.ok(prestamo);

        } catch (IllegalStateException e) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(respuestaError(e.getMessage()));

        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(respuestaError(e.getMessage()));
        }
    }

    @PutMapping("/{id}/abonar")
    public ResponseEntity<?> abonar(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        try {
            Double montoAbono = convertirDouble(body.get("abono"), "abono");

            Abono abono = prestamoService.abonarPrestamo(id, montoAbono);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(abono);

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

    @PostMapping("/{id}/pagar-pse")
    public ResponseEntity<?> pagarPorPse(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        try {
            Double montoPago = convertirDouble(body.get("monto"), "monto");

            Map<String, Object> respuesta = prestamoService.pagarPorPse(id, montoPago);

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

    @PutMapping("/abonos/{abonoId}/aprobar")
    public ResponseEntity<?> aprobarAbono(@PathVariable Long abonoId) {
        try {
            Abono abono = prestamoService.aprobarAbono(abonoId);
            return ResponseEntity.ok(abono);

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

    @PutMapping("/abonos/{abonoId}/rechazar")
    public ResponseEntity<?> rechazarAbono(@PathVariable Long abonoId) {
        try {
            Abono abono = prestamoService.rechazarAbono(abonoId);
            return ResponseEntity.ok(abono);

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

    private Map<String, Object> respuestaError(String mensaje) {
        Map<String, Object> respuesta = new LinkedHashMap<>();
        respuesta.put("ok", false);
        respuesta.put("mensaje", mensaje);
        return respuesta;
    }

    private Long convertirLong(Object valor, String campo) {
        if (valor == null || valor.toString().trim().isEmpty()) {
            throw new IllegalArgumentException("El campo " + campo + " es obligatorio.");
        }

        try {
            return Long.parseLong(valor.toString());
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("El campo " + campo + " debe ser un número válido.");
        }
    }

    private Integer convertirInteger(Object valor, String campo) {
        if (valor == null || valor.toString().trim().isEmpty()) {
            throw new IllegalArgumentException("El campo " + campo + " es obligatorio.");
        }

        try {
            return Integer.parseInt(valor.toString());
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("El campo " + campo + " debe ser un número válido.");
        }
    }

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
}
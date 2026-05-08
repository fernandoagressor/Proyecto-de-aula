package com.prestafacil.backend.service;

import com.prestafacil.backend.model.Abono;
import com.prestafacil.backend.model.Cliente;
import com.prestafacil.backend.model.ConfiguracionSistema;
import com.prestafacil.backend.model.EstadoPrestamo;
import com.prestafacil.backend.model.Prestamo;
import com.prestafacil.backend.repository.AbonoRepository;
import com.prestafacil.backend.repository.ClienteRepository;
import com.prestafacil.backend.repository.ConfiguracionSistemaRepository;
import com.prestafacil.backend.repository.PrestamoRepository;

import jakarta.transaction.Transactional;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
public class PrestamoService {

    private final PrestamoRepository prestamoRepository;
    private final ClienteRepository clienteRepository;
    private final AbonoRepository abonoRepository;
    private final ConfiguracionSistemaRepository configuracionSistemaRepository;

    public PrestamoService(
            PrestamoRepository prestamoRepository,
            ClienteRepository clienteRepository,
            AbonoRepository abonoRepository,
            ConfiguracionSistemaRepository configuracionSistemaRepository
    ) {
        this.prestamoRepository = prestamoRepository;
        this.clienteRepository = clienteRepository;
        this.abonoRepository = abonoRepository;
        this.configuracionSistemaRepository = configuracionSistemaRepository;
    }

    // =============================
    // CONSULTAS
    // =============================

    public List<Prestamo> listarPrestamos() {
        return prestamoRepository.findAll();
    }

    public List<Prestamo> listarPrestamosPorCliente(Long clienteId) {
        if (clienteId == null) {
            throw new IllegalArgumentException("El id del cliente es obligatorio.");
        }

        return prestamoRepository.findByClienteId(clienteId);
    }

    public Prestamo obtenerPorId(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("El id del préstamo es obligatorio.");
        }

        return prestamoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Préstamo no encontrado."));
    }

    // =============================
    // SOLICITUD DE PRÉSTAMO
    // =============================

    @Transactional
    public Prestamo solicitarPrestamo(Long clienteId, Double monto, Integer plazoMeses) {

        validarSolicitudPrestamo(clienteId, monto, plazoMeses);

        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado."));

        validarClienteSinPrestamoActivo(clienteId);

        Double interes = obtenerTasaInteresActual();

        Prestamo prestamo = new Prestamo();

        /*
         * Este método viene de la versión mejorada de Prestamo.java que te pasé:
         * - asigna cliente
         * - asigna monto
         * - asigna plazo
         * - asigna interés
         * - calcula total con interés
         * - calcula saldo pendiente
         * - calcula cuota mensual
         * - coloca cuotas restantes
         * - coloca estado PENDIENTE
         * - coloca fechaSolicitud
         */
        prestamo.prepararSolicitud(cliente, monto, plazoMeses, interes);

        return prestamoRepository.save(prestamo);
    }

    private void validarSolicitudPrestamo(Long clienteId, Double monto, Integer plazoMeses) {
        if (clienteId == null) {
            throw new IllegalArgumentException("Debe seleccionar un cliente.");
        }

        if (monto == null || monto <= 0) {
            throw new IllegalArgumentException("El monto del préstamo debe ser mayor a cero.");
        }

        if (plazoMeses == null || plazoMeses <= 0) {
            throw new IllegalArgumentException("El plazo debe ser mayor a cero.");
        }

        if (plazoMeses > 120) {
            throw new IllegalArgumentException("El plazo no puede superar 120 meses.");
        }
    }

    private void validarClienteSinPrestamoActivo(Long clienteId) {
        List<Prestamo> prestamosActivos = prestamoRepository.findByClienteIdAndEstadoIn(
                clienteId,
                Arrays.asList(
                        EstadoPrestamo.PENDIENTE,
                        EstadoPrestamo.APROBADO
                )
        );

        if (!prestamosActivos.isEmpty()) {
            throw new RuntimeException("El cliente ya tiene un préstamo pendiente o activo.");
        }
    }

    private Double obtenerTasaInteresActual() {
        ConfiguracionSistema configuracion = configuracionSistemaRepository.findById(1L)
                .orElse(new ConfiguracionSistema(1L, 0.02));

        Double tasa = configuracion.getTasaInteres();

        if (tasa == null || tasa < 0) {
            return 0.02;
        }

        return tasa;
    }

    // =============================
    // APROBAR / RECHAZAR PRÉSTAMO
    // =============================

    @Transactional
    public Prestamo aprobarPrestamo(Long id) {
        Prestamo prestamo = prestamoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Préstamo no encontrado."));

        prestamo.aprobar();

        return prestamoRepository.save(prestamo);
    }

    @Transactional
    public Prestamo rechazarPrestamo(Long id) {
        Prestamo prestamo = prestamoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Préstamo no encontrado."));

        prestamo.rechazar();

        return prestamoRepository.save(prestamo);
    }

    // =============================
    // SOLICITAR ABONO
    // =============================

    @Transactional
    public Abono abonarPrestamo(Long id, Double montoAbono) {
        Prestamo prestamo = prestamoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Préstamo no encontrado."));

        validarSolicitudAbono(prestamo, montoAbono);

        Abono nuevoAbono = new Abono();
        nuevoAbono.setPrestamo(prestamo);
        nuevoAbono.setMonto(montoAbono);
        nuevoAbono.setFecha(LocalDateTime.now());
        nuevoAbono.setEstado("PENDIENTE");

        /*
         * Importante:
         * El préstamo NO cambia a ABONO_PENDIENTE.
         * El préstamo sigue APROBADO.
         * El abono queda PENDIENTE hasta que el administrador lo apruebe.
         */
        return abonoRepository.save(nuevoAbono);
    }

    private void validarSolicitudAbono(Prestamo prestamo, Double montoAbono) {
        if (prestamo.getEstado() != EstadoPrestamo.APROBADO) {
            throw new RuntimeException("Solo se pueden registrar abonos en préstamos aprobados.");
        }

        if (montoAbono == null || montoAbono <= 0) {
            throw new IllegalArgumentException("El abono debe ser mayor a cero.");
        }

        if (prestamo.getSaldoPendiente() == null || prestamo.getSaldoPendiente() <= 0) {
            throw new RuntimeException("Este préstamo no tiene saldo pendiente.");
        }

        if (montoAbono > prestamo.getSaldoPendiente()) {
            throw new IllegalArgumentException("El abono no puede ser mayor al saldo pendiente.");
        }
    }

    // =============================
    // APROBAR / RECHAZAR ABONO
    // =============================

    @Transactional
    public Abono aprobarAbono(Long abonoId) {
        Abono abono = abonoRepository.findById(abonoId)
                .orElseThrow(() -> new RuntimeException("Abono no encontrado."));

        validarAbonoPendiente(abono);

        Prestamo prestamo = abono.getPrestamo();

        if (prestamo == null) {
            throw new RuntimeException("El abono no tiene préstamo asociado.");
        }

        /*
         * Este método viene de la versión mejorada de Prestamo.java.
         * Descuenta saldo, recalcula cuotas y cambia a PAGADO si el saldo llega a cero.
         */
        prestamo.aplicarAbono(abono.getMonto());

        prestamoRepository.save(prestamo);

        abono.setEstado("APROBADO");

        return abonoRepository.save(abono);
    }

    @Transactional
    public Abono rechazarAbono(Long abonoId) {
        Abono abono = abonoRepository.findById(abonoId)
                .orElseThrow(() -> new RuntimeException("Abono no encontrado."));

        validarAbonoPendiente(abono);

        /*
         * Al rechazar un abono no se toca el saldo del préstamo.
         * Solo se cambia el estado del abono.
         */
        abono.setEstado("RECHAZADO");

        return abonoRepository.save(abono);
    }

    private void validarAbonoPendiente(Abono abono) {
        if (!"PENDIENTE".equals(abono.getEstado())) {
            throw new RuntimeException("Este abono ya fue procesado.");
        }
    }
}
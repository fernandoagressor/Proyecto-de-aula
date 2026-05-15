package com.prestafacil.backend.service;

import com.prestafacil.backend.model.EmpleadoEmpresa;
import com.prestafacil.backend.repository.EmpleadoEmpresaRepository;
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

import java.text.NumberFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class PrestamoService {

    private final PrestamoRepository prestamoRepository;
    private final ClienteRepository clienteRepository;
    private final AbonoRepository abonoRepository;
    private final ConfiguracionSistemaRepository configuracionSistemaRepository;
    private final NotificacionService notificacionService;
    private final EmpleadoEmpresaRepository empleadoEmpresaRepository;

    public PrestamoService(
            PrestamoRepository prestamoRepository,
            ClienteRepository clienteRepository,
            AbonoRepository abonoRepository,
            ConfiguracionSistemaRepository configuracionSistemaRepository,
            NotificacionService notificacionService,
            EmpleadoEmpresaRepository empleadoEmpresaRepository
    ) {
        this.prestamoRepository = prestamoRepository;
        this.clienteRepository = clienteRepository;
        this.abonoRepository = abonoRepository;
        this.configuracionSistemaRepository = configuracionSistemaRepository;
        this.notificacionService = notificacionService;
        this.empleadoEmpresaRepository = empleadoEmpresaRepository;
    }

    public List<Prestamo> listarPrestamos() {
        return prestamoRepository.findAll();
    }
    // =============================
// ADMIN → SOLO CLIENTES
// =============================
    public List<Prestamo> listarPrestamosClientes() {

        return prestamoRepository.findByClienteIsNotNull();
    }

    // =============================
// EMPRESA → SOLO EMPLEADOS
// =============================
    public List<Prestamo> listarPrestamosEmpleadosPorEmpresa(Long empresaId) {

        if (empresaId == null) {
            throw new IllegalArgumentException("El id de la empresa es obligatorio.");
        }

        return prestamoRepository.findByEmpresaIdAndClienteIsNull(empresaId);
    }


    public List<Prestamo> listarPrestamosPorCliente(Long clienteId) {
        if (clienteId == null) {
            throw new IllegalArgumentException("El id del cliente es obligatorio.");
        }

        return prestamoRepository.findByClienteId(clienteId);
    }

    public List<Prestamo> listarPrestamosPorEmpleado(Long empleadoId) {
        if (empleadoId == null) {
            throw new IllegalArgumentException("El id del empleado es obligatorio.");
        }

        EmpleadoEmpresa empleado = empleadoEmpresaRepository.findById(empleadoId)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado."));

        return prestamoRepository.findByEmpleadoCedula(empleado.getCedula());
    }
    public List<Prestamo> listarPrestamosPorEmpresa(Long empresaId) {

        if (empresaId == null) {
            throw new IllegalArgumentException("El id de la empresa es obligatorio.");
        }

        return prestamoRepository.findByEmpresaId(empresaId);
    }

    public Prestamo obtenerPorId(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("El id del préstamo es obligatorio.");
        }

        return prestamoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Préstamo no encontrado."));
    }

    @Transactional
    public Prestamo solicitarPrestamo(Long clienteId, Double monto, Integer plazoMeses) {
        validarSolicitudPrestamo(clienteId, monto, plazoMeses);

        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado."));

        validarClienteSinPrestamoActivo(clienteId);

        Double interes = obtenerTasaInteresActual();

        Prestamo prestamo = new Prestamo();
        prestamo.prepararSolicitud(cliente, monto, plazoMeses, interes);

        Prestamo prestamoGuardado = prestamoRepository.save(prestamo);

        notificacionService.crearAdministrativa(
                "📝",
                "Nueva solicitud de préstamo",
                "El cliente " + obtenerNombreCliente(cliente) +
                        " solicitó un préstamo por " + formatearDinero(monto) +
                        " a " + plazoMeses + " meses."
        );

        return prestamoGuardado;
    }
    @Transactional
    public Prestamo solicitarPrestamoEmpleado(
            Long empleadoId,
            Long empresaId,
            Double monto,
            Integer plazoMeses
    ) {

        if (empleadoId == null) {
            throw new IllegalArgumentException("El empleado es obligatorio.");
        }

        if (empresaId == null) {
            throw new IllegalArgumentException("La empresa es obligatoria.");
        }

        validarSolicitudPrestamo(empleadoId, monto, plazoMeses);

        EmpleadoEmpresa empleado = empleadoEmpresaRepository.findById(empleadoId)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado."));

        Double interes = obtenerTasaInteresActual();

        Prestamo prestamo = new Prestamo();

        prestamo.prepararSolicitudEmpleado(
                empleado.getNombre(),
                empleado.getCedula(),
                empleado.getCargo(),
                empresaId,
                monto,
                plazoMeses,
                interes
        );

        Prestamo prestamoGuardado = prestamoRepository.save(prestamo);

        notificacionService.crearAdministrativa(
                "🏢",
                "Nueva solicitud de préstamo empleado",
                "El empleado " + empleado.getNombre() +
                        " solicitó un préstamo por " +
                        formatearDinero(monto) +
                        " a " + plazoMeses + " meses."
        );

        return prestamoGuardado;
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

    @Transactional
    public Prestamo aprobarPrestamo(Long id) {
        Prestamo prestamo = prestamoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Préstamo no encontrado."));

        prestamo.aprobar();

        Prestamo prestamoGuardado = prestamoRepository.save(prestamo);

        notificacionService.crearAdministrativa(
                "✅",
                "Préstamo aprobado",
                "Se aprobó el préstamo #" + prestamoGuardado.getId() +
                        " del cliente " + obtenerNombreCliente(prestamoGuardado.getCliente()) +
                        " por " + formatearDinero(prestamoGuardado.getMonto()) + "."
        );

        return prestamoGuardado;
    }

    @Transactional
    public Prestamo rechazarPrestamo(Long id) {
        Prestamo prestamo = prestamoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Préstamo no encontrado."));

        prestamo.rechazar();

        Prestamo prestamoGuardado = prestamoRepository.save(prestamo);

        notificacionService.crearAdministrativa(
                "❌",
                "Préstamo rechazado",
                "Se rechazó el préstamo #" + prestamoGuardado.getId() +
                        " del cliente " + obtenerNombreCliente(prestamoGuardado.getCliente()) + "."
        );

        return prestamoGuardado;
    }

    @Transactional
    public Abono abonarPrestamo(Long id, Double montoAbono) {
        Prestamo prestamo = prestamoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Préstamo no encontrado."));

        validarSolicitudAbono(prestamo, montoAbono);

        Abono nuevoAbono = new Abono();
        nuevoAbono.crearPendiente(prestamo, montoAbono);

        Abono abonoGuardado = abonoRepository.save(nuevoAbono);

        notificacionService.crearAdministrativa(
                "⏳",
                "Abono manual pendiente",
                "El cliente " + obtenerNombreCliente(prestamo.getCliente()) +
                        " registró un abono manual por " + formatearDinero(montoAbono) +
                        " para el préstamo #" + prestamo.getId() + "."
        );

        return abonoGuardado;
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

    @Transactional
    public Map<String, Object> pagarPorPse(Long prestamoId, Double montoPago) {
        Prestamo prestamo = prestamoRepository.findById(prestamoId)
                .orElseThrow(() -> new RuntimeException("Préstamo no encontrado."));

        validarSolicitudAbono(prestamo, montoPago);

        Double saldoAnterior = prestamo.getSaldoPendiente();
        String referenciaPago = generarReferenciaPse();

        Abono abono = new Abono();
        abono.crearAprobadoPse(prestamo, montoPago, referenciaPago);

        prestamo.aplicarAbono(montoPago);
        prestamoRepository.save(prestamo);

        Abono abonoGuardado = abonoRepository.save(abono);

        notificacionService.crearAdministrativa(
                "💳",
                "Pago PSE recibido",
                "El cliente " + obtenerNombreCliente(prestamo.getCliente()) +
                        " realizó un pago PSE por " + formatearDinero(montoPago) +
                        " para el préstamo #" + prestamo.getId() +
                        ". Referencia: " + referenciaPago + "."
        );

        if (prestamo.getEstado() == EstadoPrestamo.PAGADO) {
            notificacionService.crearAdministrativa(
                    "🏁",
                    "Préstamo pagado totalmente",
                    "El préstamo #" + prestamo.getId() +
                            " del cliente " + obtenerNombreCliente(prestamo.getCliente()) +
                            " quedó completamente pagado."
            );
        }

        Map<String, Object> respuesta = new LinkedHashMap<>();
        respuesta.put("ok", true);
        respuesta.put("mensaje", "Pago PSE aprobado correctamente.");
        respuesta.put("estadoPago", "APROBADO");
        respuesta.put("metodoPago", "PSE");
        respuesta.put("referenciaPago", referenciaPago);
        respuesta.put("abonoId", abonoGuardado.getId());
        respuesta.put("prestamoId", prestamo.getId());
        respuesta.put("montoPagado", montoPago);
        respuesta.put("saldoAnterior", saldoAnterior);
        respuesta.put("saldoPendiente", prestamo.getSaldoPendiente());
        respuesta.put("estadoPrestamo", prestamo.getEstado());
        respuesta.put("fechaPago", abonoGuardado.getFecha());
        respuesta.put("comprobanteUrl", "http://localhost:8080/api/abonos/" + abonoGuardado.getId() + "/comprobante");

        return respuesta;
    }

    private String generarReferenciaPse() {
        String fecha = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        int numero = (int) (Math.random() * 900000) + 100000;
        return "PSE-" + fecha + "-" + numero;
    }

    @Transactional
    public Abono aprobarAbono(Long abonoId) {
        Abono abono = abonoRepository.findById(abonoId)
                .orElseThrow(() -> new RuntimeException("Abono no encontrado."));

        validarAbonoPendiente(abono);

        Prestamo prestamo = abono.getPrestamo();

        if (prestamo == null) {
            throw new RuntimeException("El abono no tiene préstamo asociado.");
        }

        prestamo.aplicarAbono(abono.getMonto());
        prestamoRepository.save(prestamo);

        abono.aprobar();

        Abono abonoGuardado = abonoRepository.save(abono);

        notificacionService.crearAdministrativa(
                "✅",
                "Abono manual aprobado",
                "Se aprobó un abono manual por " + formatearDinero(abonoGuardado.getMonto()) +
                        " del cliente " + obtenerNombreCliente(prestamo.getCliente()) +
                        " para el préstamo #" + prestamo.getId() + "."
        );

        if (prestamo.getEstado() == EstadoPrestamo.PAGADO) {
            notificacionService.crearAdministrativa(
                    "🏁",
                    "Préstamo pagado totalmente",
                    "El préstamo #" + prestamo.getId() +
                            " del cliente " + obtenerNombreCliente(prestamo.getCliente()) +
                            " quedó completamente pagado."
            );
        }

        return abonoGuardado;
    }

    @Transactional
    public Abono rechazarAbono(Long abonoId) {
        Abono abono = abonoRepository.findById(abonoId)
                .orElseThrow(() -> new RuntimeException("Abono no encontrado."));

        validarAbonoPendiente(abono);

        abono.rechazar("Abono rechazado por validación administrativa.");

        Abono abonoGuardado = abonoRepository.save(abono);

        Prestamo prestamo = abonoGuardado.getPrestamo();

        notificacionService.crearAdministrativa(
                "❌",
                "Abono manual rechazado",
                "Se rechazó un abono manual por " + formatearDinero(abonoGuardado.getMonto()) +
                        " del cliente " + obtenerNombreCliente(prestamo != null ? prestamo.getCliente() : null) + "."
        );

        return abonoGuardado;
    }

    private void validarAbonoPendiente(Abono abono) {
        if (!"PENDIENTE".equals(abono.getEstado())) {
            throw new RuntimeException("Este abono ya fue procesado.");
        }
    }

    private String obtenerNombreCliente(Cliente cliente) {
        if (cliente == null || cliente.getNombre() == null || cliente.getNombre().trim().isEmpty()) {
            return "Cliente no registrado";
        }

        return cliente.getNombre();
    }

    private String formatearDinero(Double valor) {
        if (valor == null) {
            valor = 0.0;
        }

        NumberFormat formato = NumberFormat.getCurrencyInstance(new Locale("es", "CO"));
        return formato.format(valor);
    }
}
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
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class PrestamoService {

    private final PrestamoRepository prestamoRepository;
    private final ClienteRepository clienteRepository;
    private final AbonoRepository abonoRepository;
    private final ConfiguracionSistemaRepository configuracionSistemaRepository;

    public PrestamoService(PrestamoRepository prestamoRepository,
                           ClienteRepository clienteRepository,
                           AbonoRepository abonoRepository,
                           ConfiguracionSistemaRepository configuracionSistemaRepository) {
        this.prestamoRepository = prestamoRepository;
        this.clienteRepository = clienteRepository;
        this.abonoRepository = abonoRepository;
        this.configuracionSistemaRepository = configuracionSistemaRepository;
    }

    public List<Prestamo> listarPrestamos() {
        return prestamoRepository.findAll();
    }

    public List<Prestamo> listarPrestamosPorCliente(Long clienteId) {
        return prestamoRepository.findByClienteId(clienteId);
    }

    public Prestamo obtenerPorId(Long id) {
        return prestamoRepository.findById(id).orElse(null);
    }

    public Prestamo solicitarPrestamo(Long clienteId, Double monto, Integer plazoMeses) {
        Optional<Cliente> clienteOptional = clienteRepository.findById(clienteId);

        if (clienteOptional.isEmpty()) {
            throw new RuntimeException("Cliente no encontrado");
        }

        List<Prestamo> prestamosActivos = prestamoRepository.findByClienteIdAndEstadoIn(
                clienteId,
                Arrays.asList(
                        EstadoPrestamo.PENDIENTE,
                        EstadoPrestamo.APROBADO,
                        EstadoPrestamo.ABONO_PENDIENTE
                )
        );

        if (!prestamosActivos.isEmpty()) {
            throw new RuntimeException("El cliente ya tiene un préstamo activo o en proceso");
        }

        Cliente cliente = clienteOptional.get();

        ConfiguracionSistema configuracion = configuracionSistemaRepository.findById(1L)
                .orElse(new ConfiguracionSistema(1L, 0.02));

        Double interes = configuracion.getTasaInteres();

        double totalConInteres = monto + (monto * interes);
        double cuotaMensual = totalConInteres / plazoMeses;

        Prestamo prestamo = new Prestamo();
        prestamo.setCliente(cliente);
        prestamo.setMonto(monto);
        prestamo.setPlazoMeses(plazoMeses);
        prestamo.setInteres(interes);
        prestamo.setSaldoPendiente(totalConInteres);
        prestamo.setCuotaMensual(cuotaMensual);
        prestamo.setEstado(EstadoPrestamo.PENDIENTE);

        if (prestamo.getCuotaMensual() != null && prestamo.getCuotaMensual() > 0) {
            prestamo.setCuotasRestantes((int) Math.ceil(prestamo.getSaldoPendiente() / prestamo.getCuotaMensual()));
        } else {
            prestamo.setCuotasRestantes(0);
        }

        return prestamoRepository.save(prestamo);
    }

    public Prestamo aprobarPrestamo(Long id) {
        Prestamo prestamo = prestamoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prestamo no encontrado"));

        prestamo.setEstado(EstadoPrestamo.APROBADO);
        return prestamoRepository.save(prestamo);
    }

    public Prestamo rechazarPrestamo(Long id) {
        Prestamo prestamo = prestamoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prestamo no encontrado"));

        prestamo.setEstado(EstadoPrestamo.RECHAZADO);
        return prestamoRepository.save(prestamo);
    }

    public Abono abonarPrestamo(Long id, Double abono) {
        Prestamo prestamo = prestamoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Préstamo no encontrado"));

        if (prestamo.getEstado() != EstadoPrestamo.APROBADO) {
            throw new RuntimeException("Solo se puede solicitar abono a préstamos aprobados");
        }

        if (abono == null || abono <= 0) {
            throw new RuntimeException("El abono debe ser mayor a 0");
        }

        if (abono > prestamo.getSaldoPendiente()) {
            abono = prestamo.getSaldoPendiente();
        }

        Abono nuevoAbono = new Abono();
        nuevoAbono.setPrestamo(prestamo);
        nuevoAbono.setMonto(abono);
        nuevoAbono.setFecha(LocalDateTime.now());
        nuevoAbono.setEstado("PENDIENTE");

        prestamo.setEstado(EstadoPrestamo.ABONO_PENDIENTE);
        prestamoRepository.save(prestamo);

        return abonoRepository.save(nuevoAbono);
    }

    public Abono aprobarAbono(Long abonoId) {
        Abono abono = abonoRepository.findById(abonoId)
                .orElseThrow(() -> new RuntimeException("Abono no encontrado"));

        if (!"PENDIENTE".equals(abono.getEstado())) {
            throw new RuntimeException("Este abono ya fue procesado");
        }

        Prestamo prestamo = abono.getPrestamo();

        Double saldoActual = prestamo.getSaldoPendiente();
        Double montoAbono = abono.getMonto();

        if (montoAbono > saldoActual) {
            montoAbono = saldoActual;
        }

        Double nuevoSaldo = saldoActual - montoAbono;
        prestamo.setSaldoPendiente(nuevoSaldo);

        if (nuevoSaldo <= 0) {
            prestamo.setSaldoPendiente(0.0);
            prestamo.setCuotaMensual(0.0);
            prestamo.setCuotasRestantes(0);
            prestamo.setEstado(EstadoPrestamo.PAGADO);
        } else {
            if (prestamo.getCuotaMensual() != null && prestamo.getCuotaMensual() > 0) {
                prestamo.setCuotasRestantes((int) Math.ceil(nuevoSaldo / prestamo.getCuotaMensual()));
            } else {
                prestamo.setCuotasRestantes(0);
            }
            prestamo.setEstado(EstadoPrestamo.APROBADO);
        }

        prestamoRepository.save(prestamo);

        abono.setEstado("APROBADO");
        return abonoRepository.save(abono);
    }

    public Abono rechazarAbono(Long abonoId) {
        Abono abono = abonoRepository.findById(abonoId)
                .orElseThrow(() -> new RuntimeException("Abono no encontrado"));

        if (!"PENDIENTE".equals(abono.getEstado())) {
            throw new RuntimeException("Este abono ya fue procesado");
        }

        Prestamo prestamo = abono.getPrestamo();
        prestamo.setEstado(EstadoPrestamo.APROBADO);
        prestamoRepository.save(prestamo);

        abono.setEstado("RECHAZADO");
        return abonoRepository.save(abono);
    }
}
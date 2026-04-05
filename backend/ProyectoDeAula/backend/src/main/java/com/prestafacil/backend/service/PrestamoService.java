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
            return null;
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
        prestamo.setCuotasRestantes(plazoMeses);
        prestamo.setEstado(EstadoPrestamo.PENDIENTE);

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

    public Prestamo abonarPrestamo(Long id, Double abono) {
        Prestamo prestamo = prestamoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Préstamo no encontrado"));

        if (prestamo.getEstado() != EstadoPrestamo.APROBADO) {
            throw new RuntimeException("Solo se puede abonar a prestamos aprobados");
        }

        if (abono == null || abono <= 0) {
            throw new RuntimeException("El abono debe ser mayor a 0");
        }

        Double saldoActual = prestamo.getSaldoPendiente();

        if (abono > saldoActual) {
            abono = saldoActual;
        }

        Double nuevoSaldo = saldoActual - abono;
        prestamo.setSaldoPendiente(nuevoSaldo);

        if (nuevoSaldo == 0) {
            prestamo.setEstado(EstadoPrestamo.PAGADO);
            prestamo.setCuotaMensual(0.0);
            prestamo.setCuotasRestantes(0);
        } else {
            Integer cuotasRestantes = prestamo.getCuotasRestantes();

            if (cuotasRestantes == null || cuotasRestantes <= 0) {
                cuotasRestantes = 1;
            } else if (cuotasRestantes > 1) {
                cuotasRestantes = cuotasRestantes - 1;
            }

            prestamo.setCuotasRestantes(cuotasRestantes);
            prestamo.setCuotaMensual(nuevoSaldo / cuotasRestantes);
        }

        Prestamo prestamoGuardado = prestamoRepository.save(prestamo);

        Abono nuevoAbono = new Abono();
        nuevoAbono.setPrestamo(prestamoGuardado);
        nuevoAbono.setMonto(abono);
        nuevoAbono.setFecha(java.time.LocalDateTime.now());
        abonoRepository.save(nuevoAbono);

        return prestamoGuardado;
    }
}
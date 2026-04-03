package com.prestafacil.backend.service;

import com.prestafacil.backend.model.Cliente;
import com.prestafacil.backend.model.EstadoPrestamo;
import com.prestafacil.backend.model.Prestamo;
import com.prestafacil.backend.repository.ClienteRepository;
import com.prestafacil.backend.repository.PrestamoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PrestamoService {

    private final PrestamoRepository prestamoRepository;
    private final ClienteRepository clienteRepository;

    public PrestamoService(PrestamoRepository prestamoRepository, ClienteRepository clienteRepository) {
        this.prestamoRepository = prestamoRepository;
        this.clienteRepository = clienteRepository;
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

    public Prestamo solicitarPrestamo(Long clienteId, Double monto, Integer plazoMeses, Double interes) {
        Optional<Cliente> clienteOptional = clienteRepository.findById(clienteId);

        if (clienteOptional.isEmpty()) {
            return null;
        }

        Cliente cliente = clienteOptional.get();

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

        return prestamoRepository.save(prestamo);
    }

    public Prestamo aprobarPrestamo(Long id) {
        Optional<Prestamo> prestamoOptional = prestamoRepository.findById(id);

        if (prestamoOptional.isPresent()) {
            Prestamo prestamo = prestamoOptional.get();
            prestamo.setEstado(EstadoPrestamo.APROBADO);
            return prestamoRepository.save(prestamo);
        }

        return null;
    }

    public Prestamo rechazarPrestamo(Long id) {
        Optional<Prestamo> prestamoOptional = prestamoRepository.findById(id);

        if (prestamoOptional.isPresent()) {
            Prestamo prestamo = prestamoOptional.get();
            prestamo.setEstado(EstadoPrestamo.RECHAZADO);
            return prestamoRepository.save(prestamo);
        }

        return null;
    }

    public Prestamo abonarPrestamo(Long id, Double abono) {
        Optional<Prestamo> prestamoOptional = prestamoRepository.findById(id);

        if (prestamoOptional.isPresent()) {
            Prestamo prestamo = prestamoOptional.get();

            if (prestamo.getEstado() != EstadoPrestamo.APROBADO) {
                return null;
            }

            double nuevoSaldo = prestamo.getSaldoPendiente() - abono;

            if (nuevoSaldo < 0) {
                nuevoSaldo = 0;
            }

            prestamo.setSaldoPendiente(nuevoSaldo);
            return prestamoRepository.save(prestamo);
        }

        return null;
    }
}
package com.prestafacil.backend.service;

import com.prestafacil.backend.model.PrestamoEmpleado;
import com.prestafacil.backend.repository.PrestamoEmpleadoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PrestamoEmpleadoService {

    private final PrestamoEmpleadoRepository prestamoEmpleadoRepository;

    public PrestamoEmpleadoService(PrestamoEmpleadoRepository prestamoEmpleadoRepository) {
        this.prestamoEmpleadoRepository = prestamoEmpleadoRepository;
    }

    public List<PrestamoEmpleado> listar() {
        return prestamoEmpleadoRepository.findAllByOrderByFechaRegistroDesc();
    }

    public PrestamoEmpleado crear(PrestamoEmpleado prestamoEmpleado) {
        prestamoEmpleado.prepararRegistro();
        return prestamoEmpleadoRepository.save(prestamoEmpleado);
    }

    public PrestamoEmpleado actualizar(Long id, PrestamoEmpleado datos) {
        PrestamoEmpleado prestamo = prestamoEmpleadoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Préstamo de empleado no encontrado"));

        prestamo.setEmpleado(datos.getEmpleado());
        prestamo.setCedula(datos.getCedula());
        prestamo.setCargo(datos.getCargo());
        prestamo.setMonto(datos.getMonto());
        prestamo.setSaldoPendiente(datos.getSaldoPendiente());
        prestamo.setEstado(datos.getEstado());

        return prestamoEmpleadoRepository.save(prestamo);
    }

    public PrestamoEmpleado aprobar(Long id) {
        PrestamoEmpleado prestamo = prestamoEmpleadoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Préstamo de empleado no encontrado"));

        prestamo.aprobar();
        return prestamoEmpleadoRepository.save(prestamo);
    }

    public PrestamoEmpleado rechazar(Long id) {
        PrestamoEmpleado prestamo = prestamoEmpleadoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Préstamo de empleado no encontrado"));

        prestamo.rechazar();
        return prestamoEmpleadoRepository.save(prestamo);
    }

    public PrestamoEmpleado marcarPagado(Long id) {
        PrestamoEmpleado prestamo = prestamoEmpleadoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Préstamo de empleado no encontrado"));

        prestamo.marcarPagado();
        return prestamoEmpleadoRepository.save(prestamo);
    }

    public void eliminar(Long id) {
        prestamoEmpleadoRepository.deleteById(id);
    }
}
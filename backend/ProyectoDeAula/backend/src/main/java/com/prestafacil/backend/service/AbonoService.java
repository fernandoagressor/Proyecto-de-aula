package com.prestafacil.backend.service;

import com.prestafacil.backend.model.Abono;
import com.prestafacil.backend.repository.AbonoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AbonoService {

    private final AbonoRepository abonoRepository;

    public AbonoService(AbonoRepository abonoRepository) {
        this.abonoRepository = abonoRepository;
    }

    public List<Abono> listarAbonosPendientesClientes() {
        return abonoRepository
                .findByEstadoAndPrestamoClienteIsNotNullOrderByFechaDesc("PENDIENTE");
    }



    public List<Abono> listarAbonosPendientesEmpleadosPorEmpresa(Long empresaId) {
        if (empresaId == null) {
            throw new IllegalArgumentException("El id de la empresa es obligatorio.");
        }

        return abonoRepository
                .findByEstadoAndPrestamoClienteIsNullAndPrestamoEmpresaIdOrderByFechaDesc(
                        "PENDIENTE",
                        empresaId
                );
    }

    public List<Abono> listarAbonos() {
        return abonoRepository.findAll();
    }



    public List<Abono> listarAbonosPorPrestamo(Long prestamoId) {
        return abonoRepository.findByPrestamoId(prestamoId);
    }

    public List<Abono> listarAbonosPendientes() {
        return abonoRepository.findByEstado("PENDIENTE");
    }

    public Abono buscarAbonoPorId(Long abonoId) {
        return abonoRepository.findById(abonoId)
                .orElseThrow(() -> new RuntimeException("Abono no encontrado con ID: " + abonoId));
    }
}
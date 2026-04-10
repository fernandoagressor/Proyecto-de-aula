package com.prestafacil.backend.repository;

import com.prestafacil.backend.model.EstadoPrestamo;
import com.prestafacil.backend.model.Prestamo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PrestamoRepository extends JpaRepository<Prestamo, Long> {

    List<Prestamo> findByClienteId(Long clienteId);

    List<Prestamo> findByClienteIdAndEstadoIn(Long clienteId, List<EstadoPrestamo> estados);
}
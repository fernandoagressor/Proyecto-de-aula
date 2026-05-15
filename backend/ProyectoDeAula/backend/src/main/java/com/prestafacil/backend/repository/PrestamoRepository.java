package com.prestafacil.backend.repository;

import com.prestafacil.backend.model.EstadoPrestamo;
import com.prestafacil.backend.model.Prestamo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrestamoRepository extends JpaRepository<Prestamo, Long> {

    // CLIENTE ESPECÍFICO
    List<Prestamo> findByClienteId(Long clienteId);

    // EMPRESA GENERAL
    List<Prestamo> findByEmpresaId(Long empresaId);

    // ADMIN: solo préstamos de clientes
    List<Prestamo> findByClienteIsNotNull();

    // EMPRESA: solo préstamos de empleados de esa empresa
    List<Prestamo> findByEmpresaIdAndClienteIsNull(Long empresaId);

    // EMPLEADO: préstamos propios por datos del empleado
    List<Prestamo> findByEmpleadoCedula(String empleadoCedula);

    // Validación cliente activo
    List<Prestamo> findByClienteIdAndEstadoIn(
            Long clienteId,
            List<EstadoPrestamo> estados
    );

    // Validación empleado activo
    List<Prestamo> findByEmpleadoCedulaAndEstadoIn(
            String empleadoCedula,
            List<EstadoPrestamo> estados
    );
}
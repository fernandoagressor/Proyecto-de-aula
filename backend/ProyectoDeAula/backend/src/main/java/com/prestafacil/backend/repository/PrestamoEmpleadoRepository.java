package com.prestafacil.backend.repository;

import com.prestafacil.backend.model.PrestamoEmpleado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrestamoEmpleadoRepository extends JpaRepository<PrestamoEmpleado, Long> {

    List<PrestamoEmpleado> findAllByOrderByFechaRegistroDesc();
}
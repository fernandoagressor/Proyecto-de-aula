package com.prestafacil.backend.repository;

import com.prestafacil.backend.model.Abono;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AbonoRepository extends JpaRepository<Abono, Long> {

    List<Abono> findByPrestamoId(Long prestamoId);

    List<Abono> findByEstado(String estado);
}
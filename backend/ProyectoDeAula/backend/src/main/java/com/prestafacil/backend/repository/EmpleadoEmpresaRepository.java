package com.prestafacil.backend.repository;

import com.prestafacil.backend.model.EmpleadoEmpresa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmpleadoEmpresaRepository extends JpaRepository<EmpleadoEmpresa, Long> {

    List<EmpleadoEmpresa> findByEmpresaId(Long empresaId);
}
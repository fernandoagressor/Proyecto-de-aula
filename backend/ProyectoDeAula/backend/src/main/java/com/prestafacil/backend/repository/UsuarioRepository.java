package com.prestafacil.backend.repository;

import com.prestafacil.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario,Long> {
    Optional<Usuario> findByNombreAndPassword(String nombre, String password);
}
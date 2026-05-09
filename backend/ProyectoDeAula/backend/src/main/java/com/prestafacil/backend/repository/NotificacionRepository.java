package com.prestafacil.backend.repository;

import com.prestafacil.backend.model.Notificacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificacionRepository extends JpaRepository<Notificacion, Long> {

    List<Notificacion> findByRolDestinoInOrderByFechaDesc(List<String> roles);

    Long countByRolDestinoInAndLeidaFalse(List<String> roles);
}
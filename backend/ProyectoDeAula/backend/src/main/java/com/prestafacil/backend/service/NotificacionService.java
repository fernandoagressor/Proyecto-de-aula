package com.prestafacil.backend.service;

import com.prestafacil.backend.model.Notificacion;
import com.prestafacil.backend.repository.NotificacionRepository;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class NotificacionService {

    private final NotificacionRepository notificacionRepository;

    public NotificacionService(NotificacionRepository notificacionRepository) {
        this.notificacionRepository = notificacionRepository;
    }

    public Notificacion crearAdministrativa(String icono, String titulo, String mensaje) {
        Notificacion notificacion = new Notificacion(
                icono,
                titulo,
                mensaje,
                "ADMINISTRATIVO"
        );

        return notificacionRepository.save(notificacion);
    }

    public List<Notificacion> listarPorRol(String rol) {
        if ("administrador".equals(rol) || "empleado".equals(rol)) {
            return notificacionRepository.findByRolDestinoInOrderByFechaDesc(
                    Arrays.asList("ADMINISTRATIVO", rol)
            );
        }

        return List.of();
    }

    public Long contarNoLeidasPorRol(String rol) {
        if ("administrador".equals(rol) || "empleado".equals(rol)) {
            return notificacionRepository.countByRolDestinoInAndLeidaFalse(
                    Arrays.asList("ADMINISTRATIVO", rol)
            );
        }

        return 0L;
    }

    public void marcarComoLeidasPorRol(String rol) {
        List<Notificacion> notificaciones = listarPorRol(rol);

        for (Notificacion notificacion : notificaciones) {
            notificacion.setLeida(true);
        }

        notificacionRepository.saveAll(notificaciones);
    }
}
package com.prestafacil.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notificacion")
public class Notificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String icono;

    @Column(nullable = false)
    private String titulo;

    @Column(nullable = false, length = 500)
    private String mensaje;

    // ADMINISTRATIVO = visible para administrador y empleado
    @Column(nullable = false)
    private String rolDestino;

    @Column(nullable = false)
    private Boolean leida;

    @Column(nullable = false)
    private LocalDateTime fecha;

    public Notificacion() {
    }

    public Notificacion(String icono, String titulo, String mensaje, String rolDestino) {
        this.icono = icono;
        this.titulo = titulo;
        this.mensaje = mensaje;
        this.rolDestino = rolDestino;
        this.leida = false;
        this.fecha = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getIcono() {
        return icono;
    }

    public void setIcono(String icono) {
        this.icono = icono;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }

    public String getRolDestino() {
        return rolDestino;
    }

    public void setRolDestino(String rolDestino) {
        this.rolDestino = rolDestino;
    }

    public Boolean getLeida() {
        return leida;
    }

    public void setLeida(Boolean leida) {
        this.leida = leida;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }
}
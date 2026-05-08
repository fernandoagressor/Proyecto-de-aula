package com.prestafacil.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "abono")
public class Abono {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Monto solicitado como abono
    @Column(nullable = false)
    private Double monto;

    // Fecha en que el cliente o usuario registra el abono
    @Column(nullable = false)
    private LocalDateTime fecha;

    // Fecha en que el administrador aprueba el abono
    private LocalDateTime fechaAprobacion;

    // Fecha en que el administrador rechaza el abono
    private LocalDateTime fechaRechazo;

    // Estado del abono: PENDIENTE, APROBADO, RECHAZADO
    @Column(nullable = false)
    private String estado;

    // Observación opcional para auditoría o motivo de rechazo
    private String observacion;

    // Relación muchos a uno con préstamo
    @ManyToOne(optional = false)
    @JoinColumn(name = "prestamo_id", nullable = false)
    private Prestamo prestamo;

    public Abono() {
    }

    public Abono(Long id, Double monto, LocalDateTime fecha, LocalDateTime fechaAprobacion,
                 LocalDateTime fechaRechazo, String estado, String observacion, Prestamo prestamo) {
        this.id = id;
        this.monto = monto;
        this.fecha = fecha;
        this.fechaAprobacion = fechaAprobacion;
        this.fechaRechazo = fechaRechazo;
        this.estado = estado;
        this.observacion = observacion;
        this.prestamo = prestamo;
    }

    // =============================
    // MÉTODOS DE NEGOCIO
    // =============================

    public void crearPendiente(Prestamo prestamo, Double monto) {
        if (prestamo == null) {
            throw new IllegalArgumentException("El préstamo es obligatorio para registrar un abono.");
        }

        if (monto == null || monto <= 0) {
            throw new IllegalArgumentException("El monto del abono debe ser mayor a cero.");
        }

        this.prestamo = prestamo;
        this.monto = monto;
        this.fecha = LocalDateTime.now();
        this.estado = "PENDIENTE";
        this.observacion = null;
        this.fechaAprobacion = null;
        this.fechaRechazo = null;
    }

    public void aprobar() {
        if (!"PENDIENTE".equals(this.estado)) {
            throw new IllegalStateException("Solo se pueden aprobar abonos pendientes.");
        }

        this.estado = "APROBADO";
        this.fechaAprobacion = LocalDateTime.now();
    }

    public void rechazar(String observacion) {
        if (!"PENDIENTE".equals(this.estado)) {
            throw new IllegalStateException("Solo se pueden rechazar abonos pendientes.");
        }

        this.estado = "RECHAZADO";
        this.fechaRechazo = LocalDateTime.now();
        this.observacion = observacion;
    }

    public boolean estaPendiente() {
        return "PENDIENTE".equals(this.estado);
    }

    public boolean estaAprobado() {
        return "APROBADO".equals(this.estado);
    }

    public boolean estaRechazado() {
        return "RECHAZADO".equals(this.estado);
    }

    // =============================
    // GETTERS Y SETTERS
    // =============================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getMonto() {
        return monto;
    }

    public void setMonto(Double monto) {
        this.monto = monto;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    public LocalDateTime getFechaAprobacion() {
        return fechaAprobacion;
    }

    public void setFechaAprobacion(LocalDateTime fechaAprobacion) {
        this.fechaAprobacion = fechaAprobacion;
    }

    public LocalDateTime getFechaRechazo() {
        return fechaRechazo;
    }

    public void setFechaRechazo(LocalDateTime fechaRechazo) {
        this.fechaRechazo = fechaRechazo;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getObservacion() {
        return observacion;
    }

    public void setObservacion(String observacion) {
        this.observacion = observacion;
    }

    public Prestamo getPrestamo() {
        return prestamo;
    }

    public void setPrestamo(Prestamo prestamo) {
        this.prestamo = prestamo;
    }
}
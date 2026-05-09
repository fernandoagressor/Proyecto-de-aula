package com.prestafacil.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "abono")
public class Abono {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double monto;

    @Column(nullable = false)
    private LocalDateTime fecha;

    private LocalDateTime fechaAprobacion;

    private LocalDateTime fechaRechazo;

    @Column(nullable = false)
    private String estado;

    private String observacion;

    // Nuevo: MANUAL / PSE
    private String metodoPago;

    // Nuevo: referencia simulada de pago
    private String referenciaPago;

    @ManyToOne(optional = false)
    @JoinColumn(name = "prestamo_id", nullable = false)
    private Prestamo prestamo;

    public Abono() {
    }

    public Abono(Long id, Double monto, LocalDateTime fecha, LocalDateTime fechaAprobacion,
                 LocalDateTime fechaRechazo, String estado, String observacion,
                 String metodoPago, String referenciaPago, Prestamo prestamo) {
        this.id = id;
        this.monto = monto;
        this.fecha = fecha;
        this.fechaAprobacion = fechaAprobacion;
        this.fechaRechazo = fechaRechazo;
        this.estado = estado;
        this.observacion = observacion;
        this.metodoPago = metodoPago;
        this.referenciaPago = referenciaPago;
        this.prestamo = prestamo;
    }

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
        this.metodoPago = "MANUAL";
        this.referenciaPago = null;
    }

    public void crearAprobadoPse(Prestamo prestamo, Double monto, String referenciaPago) {
        if (prestamo == null) {
            throw new IllegalArgumentException("El préstamo es obligatorio para registrar el pago PSE.");
        }

        if (monto == null || monto <= 0) {
            throw new IllegalArgumentException("El monto del pago debe ser mayor a cero.");
        }

        this.prestamo = prestamo;
        this.monto = monto;
        this.fecha = LocalDateTime.now();
        this.fechaAprobacion = LocalDateTime.now();
        this.fechaRechazo = null;
        this.estado = "APROBADO";
        this.observacion = "Pago aprobado automáticamente por simulación PSE.";
        this.metodoPago = "PSE";
        this.referenciaPago = referenciaPago;
    }

    public void aprobar() {
        if (!"PENDIENTE".equals(this.estado)) {
            throw new IllegalStateException("Solo se pueden aprobar abonos pendientes.");
        }

        this.estado = "APROBADO";
        this.fechaAprobacion = LocalDateTime.now();

        if (this.metodoPago == null) {
            this.metodoPago = "MANUAL";
        }
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

    public String getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(String metodoPago) {
        this.metodoPago = metodoPago;
    }

    public String getReferenciaPago() {
        return referenciaPago;
    }

    public void setReferenciaPago(String referenciaPago) {
        this.referenciaPago = referenciaPago;
    }

    public Prestamo getPrestamo() {
        return prestamo;
    }

    public void setPrestamo(Prestamo prestamo) {
        this.prestamo = prestamo;
    }
}
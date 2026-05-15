package com.prestafacil.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "prestamo_empleado")
public class PrestamoEmpleado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String empleado;

    @Column(nullable = false)
    private String cedula;

    @Column(nullable = false)
    private String cargo;

    @Column(nullable = false)
    private Double monto;

    @Column(nullable = false)
    private Double saldoPendiente;

    @Column(nullable = false)
    private String estado;

    @Column(nullable = false)
    private LocalDateTime fechaRegistro;

    public PrestamoEmpleado() {
    }

    public void prepararRegistro() {
        if (this.empleado == null || this.empleado.trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del empleado es obligatorio.");
        }

        if (this.cedula == null || this.cedula.trim().isEmpty()) {
            throw new IllegalArgumentException("La cédula del empleado es obligatoria.");
        }

        if (this.cargo == null || this.cargo.trim().isEmpty()) {
            throw new IllegalArgumentException("El cargo del empleado es obligatorio.");
        }

        if (this.monto == null || this.monto <= 0) {
            throw new IllegalArgumentException("El monto del préstamo debe ser mayor a cero.");
        }

        this.saldoPendiente = this.monto;
        this.estado = "PENDIENTE";
        this.fechaRegistro = LocalDateTime.now();
    }

    public void aprobar() {
        this.estado = "APROBADO";
    }

    public void rechazar() {
        this.estado = "RECHAZADO";
    }

    public void marcarPagado() {
        this.estado = "PAGADO";
        this.saldoPendiente = 0.0;
    }

    public Long getId() {
        return id;
    }

    public String getEmpleado() {
        return empleado;
    }

    public void setEmpleado(String empleado) {
        this.empleado = empleado;
    }

    public String getCedula() {
        return cedula;
    }

    public void setCedula(String cedula) {
        this.cedula = cedula;
    }

    public String getCargo() {
        return cargo;
    }

    public void setCargo(String cargo) {
        this.cargo = cargo;
    }

    public Double getMonto() {
        return monto;
    }

    public void setMonto(Double monto) {
        this.monto = monto;
    }

    public Double getSaldoPendiente() {
        return saldoPendiente;
    }

    public void setSaldoPendiente(Double saldoPendiente) {
        this.saldoPendiente = saldoPendiente;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public LocalDateTime getFechaRegistro() {
        return fechaRegistro;
    }

    public void setFechaRegistro(LocalDateTime fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }
}
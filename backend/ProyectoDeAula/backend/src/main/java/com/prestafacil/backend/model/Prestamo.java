package com.prestafacil.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "prestamo")
public class Prestamo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Un cliente puede tener muchos préstamos
    @ManyToOne(optional = false)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    // Monto solicitado por el cliente
    @Column(nullable = false)
    private Double monto;

    // Plazo del préstamo en meses
    @Column(nullable = false)
    private Integer plazoMeses;

    // Interés aplicado. Ejemplo: 0.05 representa 5%
    @Column(nullable = false)
    private Double interes;

    // Total original a pagar con interés incluido
    @Column(nullable = false)
    private Double totalConInteres;

    // Saldo pendiente actual
    @Column(nullable = false)
    private Double saldoPendiente;

    // Valor mensual aproximado
    @Column(nullable = false)
    private Double cuotaMensual;

    // Cuotas pendientes por pagar
    @Column(nullable = false)
    private Integer cuotasRestantes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoPrestamo estado;

    // Fechas para trazabilidad real
    private LocalDateTime fechaSolicitud;
    private LocalDateTime fechaAprobacion;
    private LocalDateTime fechaRechazo;
    private LocalDateTime fechaPago;

    public Prestamo() {
    }

    public Prestamo(
            Long id,
            Cliente cliente,
            Double monto,
            Integer plazoMeses,
            Double interes,
            Double totalConInteres,
            Double saldoPendiente,
            Double cuotaMensual,
            Integer cuotasRestantes,
            EstadoPrestamo estado,
            LocalDateTime fechaSolicitud,
            LocalDateTime fechaAprobacion,
            LocalDateTime fechaRechazo,
            LocalDateTime fechaPago
    ) {
        this.id = id;
        this.cliente = cliente;
        this.monto = monto;
        this.plazoMeses = plazoMeses;
        this.interes = interes;
        this.totalConInteres = totalConInteres;
        this.saldoPendiente = saldoPendiente;
        this.cuotaMensual = cuotaMensual;
        this.cuotasRestantes = cuotasRestantes;
        this.estado = estado;
        this.fechaSolicitud = fechaSolicitud;
        this.fechaAprobacion = fechaAprobacion;
        this.fechaRechazo = fechaRechazo;
        this.fechaPago = fechaPago;
    }

    // =============================
    // MÉTODOS DE NEGOCIO
    // =============================

    /**
     * Prepara un préstamo nuevo en estado pendiente.
     * Se usa cuando el cliente o administrador crea una solicitud.
     */
    public void prepararSolicitud(Cliente cliente, Double monto, Integer plazoMeses, Double interes) {
        validarDatosBase(cliente, monto, plazoMeses, interes);

        this.cliente = cliente;
        this.monto = monto;
        this.plazoMeses = plazoMeses;
        this.interes = interes;
        this.estado = EstadoPrestamo.PENDIENTE;
        this.fechaSolicitud = LocalDateTime.now();

        calcularValoresFinancieros();
    }

    /**
     * Aprueba el préstamo.
     */
    public void aprobar() {
        if (this.estado != EstadoPrestamo.PENDIENTE) {
            throw new IllegalStateException("Solo se pueden aprobar préstamos pendientes.");
        }

        this.estado = EstadoPrestamo.APROBADO;
        this.fechaAprobacion = LocalDateTime.now();
    }

    /**
     * Rechaza el préstamo.
     */
    public void rechazar() {
        if (this.estado != EstadoPrestamo.PENDIENTE) {
            throw new IllegalStateException("Solo se pueden rechazar préstamos pendientes.");
        }

        this.estado = EstadoPrestamo.RECHAZADO;
        this.fechaRechazo = LocalDateTime.now();
    }

    /**
     * Aplica un abono aprobado al préstamo.
     */
    public void aplicarAbono(Double montoAbono) {
        if (this.estado != EstadoPrestamo.APROBADO) {
            throw new IllegalStateException("Solo se pueden abonar préstamos aprobados.");
        }

        if (montoAbono == null || montoAbono <= 0) {
            throw new IllegalArgumentException("El abono debe ser mayor a cero.");
        }

        if (montoAbono > this.saldoPendiente) {
            throw new IllegalArgumentException("El abono no puede ser mayor al saldo pendiente.");
        }

        this.saldoPendiente = this.saldoPendiente - montoAbono;

        if (this.saldoPendiente <= 0) {
            this.saldoPendiente = 0.0;
            this.cuotaMensual = 0.0;
            this.cuotasRestantes = 0;
            this.estado = EstadoPrestamo.PAGADO;
            this.fechaPago = LocalDateTime.now();
            return;
        }

        recalcularCuotasRestantes();
    }

    /**
     * Calcula monto total, saldo pendiente y cuota mensual.
     */
    public void calcularValoresFinancieros() {
        validarDatosBase(this.cliente, this.monto, this.plazoMeses, this.interes);

        this.totalConInteres = this.monto + (this.monto * this.interes);
        this.saldoPendiente = this.totalConInteres;
        this.cuotaMensual = this.totalConInteres / this.plazoMeses;
        this.cuotasRestantes = this.plazoMeses;
    }

    /**
     * Recalcula cuotas restantes según saldo y cuota.
     */
    public void recalcularCuotasRestantes() {
        if (this.saldoPendiente == null || this.saldoPendiente <= 0) {
            this.cuotasRestantes = 0;
            return;
        }

        if (this.cuotaMensual == null || this.cuotaMensual <= 0) {
            this.cuotasRestantes = 0;
            return;
        }

        this.cuotasRestantes = (int) Math.ceil(this.saldoPendiente / this.cuotaMensual);
    }

    /**
     * Valida datos mínimos para evitar préstamos incompletos.
     */
    private void validarDatosBase(Cliente cliente, Double monto, Integer plazoMeses, Double interes) {
        if (cliente == null) {
            throw new IllegalArgumentException("El cliente es obligatorio.");
        }

        if (monto == null || monto <= 0) {
            throw new IllegalArgumentException("El monto debe ser mayor a cero.");
        }

        if (plazoMeses == null || plazoMeses <= 0) {
            throw new IllegalArgumentException("El plazo debe ser mayor a cero.");
        }

        if (interes == null || interes < 0) {
            throw new IllegalArgumentException("El interés no puede ser negativo.");
        }
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

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public Double getMonto() {
        return monto;
    }

    public void setMonto(Double monto) {
        this.monto = monto;
    }

    public Integer getPlazoMeses() {
        return plazoMeses;
    }

    public void setPlazoMeses(Integer plazoMeses) {
        this.plazoMeses = plazoMeses;
    }

    public Double getInteres() {
        return interes;
    }

    public void setInteres(Double interes) {
        this.interes = interes;
    }

    public Double getTotalConInteres() {
        return totalConInteres;
    }

    public void setTotalConInteres(Double totalConInteres) {
        this.totalConInteres = totalConInteres;
    }

    public Double getSaldoPendiente() {
        return saldoPendiente;
    }

    public void setSaldoPendiente(Double saldoPendiente) {
        this.saldoPendiente = saldoPendiente;
    }

    public Double getCuotaMensual() {
        return cuotaMensual;
    }

    public void setCuotaMensual(Double cuotaMensual) {
        this.cuotaMensual = cuotaMensual;
    }

    public Integer getCuotasRestantes() {
        return cuotasRestantes;
    }

    public void setCuotasRestantes(Integer cuotasRestantes) {
        this.cuotasRestantes = cuotasRestantes;
    }

    public EstadoPrestamo getEstado() {
        return estado;
    }

    public void setEstado(EstadoPrestamo estado) {
        this.estado = estado;
    }

    public LocalDateTime getFechaSolicitud() {
        return fechaSolicitud;
    }

    public void setFechaSolicitud(LocalDateTime fechaSolicitud) {
        this.fechaSolicitud = fechaSolicitud;
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

    public LocalDateTime getFechaPago() {
        return fechaPago;
    }

    public void setFechaPago(LocalDateTime fechaPago) {
        this.fechaPago = fechaPago;
    }
}
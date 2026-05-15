package com.prestafacil.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "prestamo")
public class Prestamo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Cliente persona natural.
    // Puede ser null si el préstamo pertenece a un empleado de empresa.
    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    // Datos del empleado de empresa.
    // Se usan cuando el préstamo no pertenece a un cliente natural.
    @Column(name = "empleado_nombre")
    private String empleadoNombre;

    @Column(name = "empleado_cedula")
    private String empleadoCedula;

    @Column(name = "empleado_cargo")
    private String empleadoCargo;

    @Column(name = "empresa_id")
    private Long empresaId;

    @Column(nullable = false)
    private Double monto;

    @Column(nullable = false)
    private Integer plazoMeses;

    @Column(nullable = false)
    private Double interes;

    @Column(nullable = false)
    private Double totalConInteres;

    @Column(nullable = false)
    private Double saldoPendiente;

    @Column(nullable = false)
    private Double cuotaMensual;

    @Column(nullable = false)
    private Integer cuotasRestantes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoPrestamo estado;

    private LocalDateTime fechaSolicitud;
    private LocalDateTime fechaAprobacion;
    private LocalDateTime fechaRechazo;
    private LocalDateTime fechaPago;

    public Prestamo() {
    }

    public void prepararSolicitud(
            Cliente cliente,
            Double monto,
            Integer plazoMeses,
            Double interes
    ) {
        validarDatosBase(monto, plazoMeses, interes);

        if (cliente == null) {
            throw new IllegalArgumentException("El cliente es obligatorio.");
        }

        this.cliente = cliente;
        this.empresaId = cliente.getEmpresaId();

        this.empleadoNombre = null;
        this.empleadoCedula = null;
        this.empleadoCargo = null;

        this.monto = monto;
        this.plazoMeses = plazoMeses;
        this.interes = interes;
        this.estado = EstadoPrestamo.PENDIENTE;
        this.fechaSolicitud = LocalDateTime.now();

        calcularValoresFinancieros();
    }

    public void prepararSolicitudEmpleado(
            String empleadoNombre,
            String empleadoCedula,
            String empleadoCargo,
            Long empresaId,
            Double monto,
            Integer plazoMeses,
            Double interes
    ) {
        validarDatosBase(monto, plazoMeses, interes);

        if (empleadoNombre == null || empleadoNombre.trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del empleado es obligatorio.");
        }

        if (empleadoCedula == null || empleadoCedula.trim().isEmpty()) {
            throw new IllegalArgumentException("La cédula del empleado es obligatoria.");
        }

        if (empleadoCargo == null || empleadoCargo.trim().isEmpty()) {
            throw new IllegalArgumentException("El cargo del empleado es obligatorio.");
        }

        if (empresaId == null) {
            throw new IllegalArgumentException("El id de la empresa es obligatorio.");
        }

        this.cliente = null;
        this.empleadoNombre = empleadoNombre;
        this.empleadoCedula = empleadoCedula;
        this.empleadoCargo = empleadoCargo;
        this.empresaId = empresaId;

        this.monto = monto;
        this.plazoMeses = plazoMeses;
        this.interes = interes;
        this.estado = EstadoPrestamo.PENDIENTE;
        this.fechaSolicitud = LocalDateTime.now();

        calcularValoresFinancieros();
    }

    public void aprobar() {
        if (this.estado != EstadoPrestamo.PENDIENTE) {
            throw new IllegalStateException("Solo se pueden aprobar préstamos pendientes.");
        }

        this.estado = EstadoPrestamo.APROBADO;
        this.fechaAprobacion = LocalDateTime.now();
    }

    public void rechazar() {
        if (this.estado != EstadoPrestamo.PENDIENTE) {
            throw new IllegalStateException("Solo se pueden rechazar préstamos pendientes.");
        }

        this.estado = EstadoPrestamo.RECHAZADO;
        this.fechaRechazo = LocalDateTime.now();
    }

    public void aplicarAbono(Double montoAbono) {
        if (this.estado != EstadoPrestamo.APROBADO) {
            throw new IllegalStateException("Solo se pueden abonar préstamos aprobados.");
        }

        if (montoAbono == null || montoAbono <= 0) {
            throw new IllegalArgumentException("El abono debe ser mayor a cero.");
        }

        if (this.saldoPendiente == null || this.saldoPendiente <= 0) {
            throw new IllegalStateException("Este préstamo no tiene saldo pendiente.");
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

    public void calcularValoresFinancieros() {
        validarDatosBase(this.monto, this.plazoMeses, this.interes);

        this.totalConInteres = this.monto + (this.monto * this.interes);
        this.saldoPendiente = this.totalConInteres;
        this.cuotaMensual = this.totalConInteres / this.plazoMeses;
        this.cuotasRestantes = this.plazoMeses;
    }

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

    private void validarDatosBase(Double monto, Integer plazoMeses, Double interes) {
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

    public String obtenerNombreTitular() {
        if (cliente != null && cliente.getNombre() != null && !cliente.getNombre().trim().isEmpty()) {
            return cliente.getNombre();
        }

        if (empleadoNombre != null && !empleadoNombre.trim().isEmpty()) {
            return empleadoNombre;
        }

        return "Titular no registrado";
    }

    public boolean esPrestamoCliente() {
        return cliente != null;
    }

    public boolean esPrestamoEmpleado() {
        return empleadoNombre != null && !empleadoNombre.trim().isEmpty();
    }

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
        this.empresaId = cliente != null ? cliente.getEmpresaId() : null;
    }

    public String getEmpleadoNombre() {
        return empleadoNombre;
    }

    public void setEmpleadoNombre(String empleadoNombre) {
        this.empleadoNombre = empleadoNombre;
    }

    public String getEmpleadoCedula() {
        return empleadoCedula;
    }

    public void setEmpleadoCedula(String empleadoCedula) {
        this.empleadoCedula = empleadoCedula;
    }

    public String getEmpleadoCargo() {
        return empleadoCargo;
    }

    public void setEmpleadoCargo(String empleadoCargo) {
        this.empleadoCargo = empleadoCargo;
    }

    public Long getEmpresaId() {
        return empresaId;
    }

    public void setEmpresaId(Long empresaId) {
        this.empresaId = empresaId;
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
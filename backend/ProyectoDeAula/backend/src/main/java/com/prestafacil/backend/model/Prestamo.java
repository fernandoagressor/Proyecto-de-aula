package com.prestafacil.backend.model;

import jakarta.persistence.*;

@Entity
public class Prestamo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Cliente cliente;
    private Double monto;
    private Integer plazoMeses;
    private Double interes;
    private Double saldoPendiente;
    private Double cuotaMensual;

    @Enumerated(EnumType.STRING)
    private EstadoPrestamo estado;

    public Prestamo() {

    }
    public Prestamo(Long id, Cliente cliente, Double monto, Integer plazoMeses, Double interes,
                    Double saldoPendiente,  Double cuotaMensual, EstadoPrestamo estado){
        this.id = id;
        this.cliente = cliente;
        this.monto = monto;
        this.plazoMeses = plazoMeses;
        this.interes = interes;
        this.saldoPendiente = saldoPendiente;
        this.cuotaMensual = cuotaMensual;
        this.estado = estado;
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
    public EstadoPrestamo getEstado() {
        return estado;
    }
    public void setEstado(EstadoPrestamo estado) {
        this.estado = estado;
    }
}

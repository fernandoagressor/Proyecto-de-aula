package com.prestafacil.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "configuracion_sistema")
public class ConfiguracionSistema {

    @Id
    private Long id;

    // Tasa en formato decimal.
    // Ejemplo: 0.05 equivale a 5%.
    @Column(nullable = false)
    private Double tasaInteres;

    // Fecha de la última actualización de la tasa.
    private LocalDateTime fechaActualizacion;

    public ConfiguracionSistema() {
    }

    public ConfiguracionSistema(Long id, Double tasaInteres) {
        this.id = id;
        setTasaInteres(tasaInteres);
        this.fechaActualizacion = LocalDateTime.now();
    }

    // =============================
    // MÉTODOS DE NEGOCIO
    // =============================

    public void actualizarTasa(Double nuevaTasa) {
        validarTasa(nuevaTasa);

        this.tasaInteres = nuevaTasa;
        this.fechaActualizacion = LocalDateTime.now();
    }

    private void validarTasa(Double tasa) {
        if (tasa == null) {
            throw new IllegalArgumentException("La tasa de interés es obligatoria.");
        }

        if (tasa < 0) {
            throw new IllegalArgumentException("La tasa de interés no puede ser negativa.");
        }

        if (tasa > 1) {
            throw new IllegalArgumentException("La tasa debe ingresarse en formato decimal. Ejemplo: 0.05 para 5%.");
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

    public Double getTasaInteres() {
        return tasaInteres;
    }

    public void setTasaInteres(Double tasaInteres) {
        validarTasa(tasaInteres);
        this.tasaInteres = tasaInteres;
    }

    public LocalDateTime getFechaActualizacion() {
        return fechaActualizacion;
    }

    public void setFechaActualizacion(LocalDateTime fechaActualizacion) {
        this.fechaActualizacion = fechaActualizacion;
    }
}
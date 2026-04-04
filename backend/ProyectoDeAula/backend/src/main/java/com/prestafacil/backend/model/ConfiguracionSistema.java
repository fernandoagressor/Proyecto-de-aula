package com.prestafacil.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class ConfiguracionSistema {

    @Id
    private Long id;

    private Double tasaInteres;

    public ConfiguracionSistema() {
    }

    public ConfiguracionSistema(Long id, Double tasaInteres) {
        this.id = id;
        this.tasaInteres = tasaInteres;
    }

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
        this.tasaInteres = tasaInteres;
    }
}
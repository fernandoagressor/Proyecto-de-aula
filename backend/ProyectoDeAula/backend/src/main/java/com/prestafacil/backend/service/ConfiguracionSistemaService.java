package com.prestafacil.backend.service;

import com.prestafacil.backend.model.ConfiguracionSistema;
import com.prestafacil.backend.repository.ConfiguracionSistemaRepository;

import jakarta.transaction.Transactional;

import org.springframework.stereotype.Service;

@Service
public class ConfiguracionSistemaService {

    private static final Long CONFIG_ID = 1L;
    private static final Double TASA_DEFAULT = 0.02; // 2%

    private final ConfiguracionSistemaRepository configuracionSistemaRepository;

    public ConfiguracionSistemaService(ConfiguracionSistemaRepository configuracionSistemaRepository) {
        this.configuracionSistemaRepository = configuracionSistemaRepository;
    }

    // =============================
    // OBTENER CONFIGURACIÓN
    // =============================

    public ConfiguracionSistema obtenerConfiguracion() {
        return configuracionSistemaRepository.findById(CONFIG_ID)
                .orElseGet(this::crearConfiguracionPorDefecto);
    }

    // =============================
    // ACTUALIZAR TASA DE INTERÉS
    // =============================

    @Transactional
    public ConfiguracionSistema actualizarTasa(Double tasaInteres) {
        validarTasa(tasaInteres);

        ConfiguracionSistema configuracion = configuracionSistemaRepository.findById(CONFIG_ID)
                .orElseGet(this::crearConfiguracionPorDefecto);

        /*
         * Este método viene del ConfiguracionSistema.java mejorado.
         * Actualiza la tasa y también fechaActualizacion.
         */
        configuracion.actualizarTasa(tasaInteres);

        return configuracionSistemaRepository.save(configuracion);
    }

    // =============================
    // CREAR CONFIGURACIÓN DEFAULT
    // =============================

    private ConfiguracionSistema crearConfiguracionPorDefecto() {
        ConfiguracionSistema configuracion = new ConfiguracionSistema(CONFIG_ID, TASA_DEFAULT);
        return configuracionSistemaRepository.save(configuracion);
    }

    // =============================
    // VALIDACIONES
    // =============================

    private void validarTasa(Double tasaInteres) {
        if (tasaInteres == null) {
            throw new IllegalArgumentException("La tasa de interés es obligatoria.");
        }

        if (tasaInteres < 0) {
            throw new IllegalArgumentException("La tasa de interés no puede ser negativa.");
        }

        if (tasaInteres > 1) {
            throw new IllegalArgumentException("La tasa debe guardarse en formato decimal. Ejemplo: 0.05 para 5%.");
        }
    }
}
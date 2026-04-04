package com.prestafacil.backend.service;

import com.prestafacil.backend.model.ConfiguracionSistema;
import com.prestafacil.backend.repository.ConfiguracionSistemaRepository;
import org.springframework.stereotype.Service;

@Service
public class ConfiguracionSistemaService {

    private final ConfiguracionSistemaRepository configuracionSistemaRepository;

    public ConfiguracionSistemaService(ConfiguracionSistemaRepository configuracionSistemaRepository) {
        this.configuracionSistemaRepository = configuracionSistemaRepository;
    }

    public ConfiguracionSistema obtenerConfiguracion() {
        return configuracionSistemaRepository.findById(1L)
                .orElseGet(() -> configuracionSistemaRepository.save(new ConfiguracionSistema(1L, 0.02)));
    }

    public ConfiguracionSistema actualizarTasa(Double tasaInteres) {
        ConfiguracionSistema configuracion = configuracionSistemaRepository.findById(1L)
                .orElse(new ConfiguracionSistema(1L, tasaInteres));

        configuracion.setTasaInteres(tasaInteres);
        return configuracionSistemaRepository.save(configuracion);
    }
}
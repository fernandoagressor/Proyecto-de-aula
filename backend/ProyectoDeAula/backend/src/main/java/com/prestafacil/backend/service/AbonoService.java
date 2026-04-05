package com.prestafacil.backend.service;

import com.prestafacil.backend.model.Abono;
import com.prestafacil.backend.repository.AbonoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AbonoService {

    private final AbonoRepository abonoRepository;

    public AbonoService(AbonoRepository abonoRepository) {
        this.abonoRepository = abonoRepository;
    }

    public List<Abono> listarAbonos() {
        return abonoRepository.findAll();
    }

    public List<Abono> listarAbonosPorPrestamo(Long prestamoId) {
        return abonoRepository.findByPrestamoId(prestamoId);
    }
}
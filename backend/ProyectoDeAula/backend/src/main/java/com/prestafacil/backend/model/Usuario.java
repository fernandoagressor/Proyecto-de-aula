package com.prestafacil.backend.model;

import jakarta.persistence.*;

@Entity
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación opcional con cliente.
    private Long clienteId;

    private Long empleadoId;

    // Relación con empresa.
    private Long empresaId;

    // Usuario/login.
    private String nombre;

    // Contraseña.
    private String password;

    // Rol del usuario.
    private String rol;

    public Usuario() {
    }

    public Usuario(
            Long id,
            String nombre,
            String password,
            String rol,
            Long empresaId
    ) {
        this.id = id;
        this.nombre = nombre;
        this.password = password;
        this.rol = rol;
        this.empresaId = empresaId;
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

    public Long getClienteId() {
        return clienteId;
    }

    public Long getEmpleadoId() {
        return empleadoId;
    }

    public void setEmpleadoId(Long empleadoId) {
        this.empleadoId = empleadoId;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }

    public Long getEmpresaId() {
        return empresaId;
    }

    public void setEmpresaId(Long empresaId) {
        this.empresaId = empresaId;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }
}
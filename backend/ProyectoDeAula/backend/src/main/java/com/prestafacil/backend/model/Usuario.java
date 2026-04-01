package com.prestafacil.backend.model;

public class Usuario {
    private Long id;
    private String nombre;
    private String password;
    private String rol;

    public Usuario(){

    }
    public Usuario(Long id, String nombre, String password,String rol){
        this.id = id;
        this.nombre = nombre;
        this.password = password;
        this.rol = rol;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
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

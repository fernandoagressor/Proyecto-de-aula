// Indica el paquete donde está ubicado este modelo.
package com.prestafacil.backend.model;

// Importa las anotaciones necesarias de JPA para mapear la clase a una tabla.
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

// Indica que esta clase es una entidad de base de datos.
// Representa la tabla usuario en MySQL.
@Entity
public class Usuario {

    // Marca este campo como la llave primaria.
    @Id

    // Indica que el id se genera automáticamente en MySQL (AUTO_INCREMENT).
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Guarda el id del cliente asociado a este usuario.
    // Sirve para relacionar el usuario con un cliente.
    private Long clienteId;

    // Nombre de usuario (en tu sistema es la cédula).
    private String nombre;

    // Contraseña del usuario.
    private String password;

    // Rol del usuario (ej: ADMIN, EMPLEADO, CLIENTE).
    private String rol;

    // Constructor vacío requerido por JPA.
    public Usuario(){
    }

    // Constructor con parámetros para crear un usuario con datos.
    public Usuario(Long id, String nombre, String password,String rol){

        // Asigna el id recibido.
        this.id = id;

        // Asigna el nombre de usuario.
        this.nombre = nombre;

        // Asigna la contraseña.
        this.password = password;

        // Asigna el rol.
        this.rol = rol;
    }

    // =============================
    // GETTERS Y SETTERS
    // =============================

    // Devuelve el id del usuario.
    public long getId() {
        return id;
    }

    // Permite cambiar el id del usuario.
    public void setId(long id) {
        this.id = id;
    }

    // Devuelve el id del cliente asociado.
    public Long getClienteId() {
        return clienteId;
    }

    // Permite asignar o cambiar el cliente asociado.
    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }

    // Devuelve el nombre de usuario.
    public String getNombre() {
        return nombre;
    }

    // Permite cambiar el nombre de usuario.
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    // Devuelve la contraseña.
    public String getPassword() {
        return password;
    }

    // Permite cambiar la contraseña.
    public void setPassword(String password) {
        this.password = password;
    }

    // Devuelve el rol del usuario.
    public String getRol() {
        return rol;
    }

    // Permite cambiar el rol.
    public void setRol(String rol) {
        this.rol = rol;
    }
}
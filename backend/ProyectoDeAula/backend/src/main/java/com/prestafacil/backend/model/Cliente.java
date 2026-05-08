// Indica el paquete donde está ubicado este modelo.
package com.prestafacil.backend.model;

// Importa la anotación Entity para indicar que esta clase será una tabla en MySQL.
import jakarta.persistence.Entity;

// Importa GeneratedValue para generar automáticamente el id.
import jakarta.persistence.GeneratedValue;

// Importa GenerationType para definir cómo se genera el id.
import jakarta.persistence.GenerationType;

// Importa Id para marcar la llave primaria.
import jakarta.persistence.Id;

// Indica que esta clase es una entidad de base de datos.
// Es decir, representa una tabla en MySQL.
@Entity
public class Cliente{

    // Marca este atributo como la llave primaria de la tabla.
    @Id

    // Indica que el id se genera automáticamente en MySQL (AUTO_INCREMENT).
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    // Identificador único del cliente.
    private Long id;

    // Nombre del cliente.
    private String nombre;

    // Cédula del cliente.
    private String cedula;

    // Teléfono del cliente.
    private String telefono;

    // Dirección del cliente.
    private String direccion;

    // Constructor vacío requerido por JPA (obligatorio).
    public Cliente() {
    }

    // Constructor con parámetros para crear un cliente con datos.
    public Cliente(Long id, String nombre,String cedula, String telefono, String direccion) {

        // Asigna el id recibido al atributo id.
        this.id = id;

        // Asigna el nombre recibido al atributo nombre.
        this.nombre = nombre;

        // Asigna la cédula recibida al atributo cedula.
        this.cedula = cedula;

        // Asigna el teléfono recibido al atributo telefono.
        this.telefono = telefono;

        // Asigna la dirección recibida al atributo direccion.
        this.direccion = direccion;
    }

    // =============================
    // GETTERS Y SETTERS
    // =============================

    // Devuelve el id del cliente.
    public Long getId() {return id;}

    // Permite cambiar el id del cliente.
    public void setId(Long id) {this.id = id;}

    // Devuelve el nombre del cliente.
    public String getNombre() {return nombre;}

    // Permite cambiar el nombre del cliente.
    public void setNombre(String nombre) {this.nombre = nombre;}

    // Devuelve la cédula del cliente.
    public String getCedula() {return cedula;}

    // Permite cambiar la cédula del cliente.
    public void setCedula(String cedula) {this.cedula = cedula;}

    // Devuelve el teléfono del cliente.
    public String getTelefono() {return telefono;}

    // Permite cambiar el teléfono del cliente.
    public void setTelefono(String telefono) {this.telefono = telefono;}

    // Devuelve la dirección del cliente.
    public String getDireccion() {return direccion;}

    // Permite cambiar la dirección del cliente.
    public void setDireccion(String direccion) {this.direccion = direccion;}

}
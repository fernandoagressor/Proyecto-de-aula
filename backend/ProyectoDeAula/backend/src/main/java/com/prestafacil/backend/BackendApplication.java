// Indica el paquete principal del proyecto.
// Desde aquí Spring Boot escanea todo el proyecto (controllers, services, etc).
package com.prestafacil.backend;

// Importa la clase SpringApplication que se encarga de arrancar la aplicación.
import org.springframework.boot.SpringApplication;

// Importa la anotación que configura automáticamente todo Spring Boot.
import org.springframework.boot.autoconfigure.SpringBootApplication;

// Esta anotación hace 3 cosas importantes:
// 1. @Configuration → permite configurar la aplicación
// 2. @EnableAutoConfiguration → configura automáticamente Spring Boot
// 3. @ComponentScan → busca clases @Controller, @Service, @Repository
@SpringBootApplication
public class BackendApplication {

    // Método principal (punto de entrada del programa).
    public static void main(String[] args) {

        // Arranca toda la aplicación Spring Boot.
        // Inicializa el servidor (Tomcat), carga controladores, servicios y conexión a MySQL.
        SpringApplication.run(BackendApplication.class, args);
    }

}
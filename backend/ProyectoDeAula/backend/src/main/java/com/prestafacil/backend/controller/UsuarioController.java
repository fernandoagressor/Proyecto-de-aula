// Indica el paquete donde está este controlador.
package com.prestafacil.backend.controller;

// Importa el modelo Usuario (tabla usuario en MySQL).
import com.prestafacil.backend.model.Usuario;

// Importa el servicio donde está la lógica de usuarios.
import com.prestafacil.backend.service.UsuarioService;

// Importa anotaciones REST de Spring (GET, POST, PUT, DELETE, etc).
import org.springframework.web.bind.annotation.*;

// Importa List para manejar listas de usuarios.
import java.util.List;

// Importa Map para recibir datos tipo JSON clave-valor.
import java.util.Map;

// Indica que esta clase es un controlador REST.
// Recibe peticiones HTTP y devuelve datos en JSON.
@RestController

// Define la ruta base del controlador.
// Todas las rutas empiezan con /api/usuarios.
@RequestMapping("/api/usuarios")

// Permite que Angular (puerto 4200) se conecte con este backend.
@CrossOrigin(origins = "http://localhost:4200")

// Clase controladora de usuarios.
public class UsuarioController {

    // Variable que guarda el servicio de usuarios.
    private final UsuarioService usuarioService;

    // Constructor donde Spring inyecta automáticamente el servicio.
    public UsuarioController(UsuarioService usuarioService) {

        // Guarda el servicio en la variable de la clase.
        this.usuarioService = usuarioService;
    }

    // =============================
    // LISTAR TODOS LOS USUARIOS
    // =============================

    // Atiende peticiones GET a:
    // http://localhost:8080/api/usuarios
    @GetMapping
    public List<Usuario> listarUsuarios() {

        // Llama al servicio para traer todos los usuarios desde MySQL.
        return usuarioService.listarUsuarios();
    }

    // =============================
    // CREAR USUARIO
    // =============================

    // Atiende peticiones POST a:
    // http://localhost:8080/api/usuarios
    @PostMapping
    public Usuario crearUsuario(@RequestBody Usuario usuario) {

        // @RequestBody convierte el JSON que envía Angular en un objeto Usuario.
        // Luego lo envía al servicio para guardarlo en MySQL.
        return usuarioService.crearUsuario(usuario);
    }

    // =============================
    // ACTUALIZAR USUARIO
    // =============================

    // Atiende peticiones PUT a:
    // http://localhost:8080/api/usuarios/{id}
    @PutMapping("/{id}")
    public Usuario actualizarUsuario(@PathVariable Long id, @RequestBody Usuario usuario) {

        // @PathVariable obtiene el id desde la URL.
        // @RequestBody obtiene los nuevos datos desde Angular.
        // Se envía al servicio para actualizar en MySQL.
        return usuarioService.actualizarUsuario(id, usuario);
    }

    // =============================
    // ELIMINAR USUARIO
    // =============================

    // Atiende peticiones DELETE a:
    // http://localhost:8080/api/usuarios/{id}
    @DeleteMapping("/{id}")
    public void eliminarUsuario(@PathVariable Long id) {

        // Llama al servicio para eliminar el usuario en la base de datos.
        usuarioService.eliminarUsuario(id);
    }

    // =============================
    // LOGIN DE USUARIO
    // =============================

    // Atiende peticiones POST a:
    // http://localhost:8080/api/usuarios/login
    @PostMapping("/login")
    public Usuario login(@RequestBody Map<String, String> datos) {

        // Recibe un JSON como este:
        // {
        //   "nombre": "123456",
        //   "password": "123456"
        // }

        // datos.get("nombre") obtiene el usuario ingresado.
        // datos.get("password") obtiene la contraseña ingresada.

        // Llama al servicio para validar el login.
        return usuarioService.login(datos.get("nombre"), datos.get("password"));
    }
}
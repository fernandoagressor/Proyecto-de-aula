// Indica el paquete donde está ubicado este servicio.
package com.prestafacil.backend.service;

// Importa la entidad Usuario (tabla usuario en MySQL).
import com.prestafacil.backend.model.Usuario;

// Importa el repositorio que se encarga de acceder a la base de datos.
import com.prestafacil.backend.repository.UsuarioRepository;

// Importa la anotación Service para indicar que esta clase es lógica de negocio.
import org.springframework.stereotype.Service;

// Importa List para manejar listas de usuarios.
import java.util.List;

// Marca esta clase como servicio de Spring.
@Service
public class UsuarioService {

    // Variable que almacena el repositorio de usuarios.
    private final UsuarioRepository usuarioRepository;

    // Constructor donde Spring inyecta automáticamente el repositorio.
    public UsuarioService(UsuarioRepository usuarioRepository) {

        // Guarda el repositorio en la variable de la clase.
        this.usuarioRepository = usuarioRepository;
    }

    // =============================
    // LISTAR TODOS LOS USUARIOS
    // =============================

    public List<Usuario> listarUsuarios() {

        // Consulta todos los usuarios en la base de datos.
        // Equivale a: SELECT * FROM usuario;
        return usuarioRepository.findAll();
    }

    // =============================
    // CREAR USUARIO
    // =============================

    public Usuario crearUsuario(Usuario usuario) {

        // Guarda el usuario en la base de datos.
        // Si no tiene id → INSERT
        // Si tiene id → UPDATE
        return usuarioRepository.save(usuario);
    }

    // =============================
    // ACTUALIZAR USUARIO
    // =============================

    public Usuario actualizarUsuario(Long id, Usuario usuarioActualizado) {

        // Busca el usuario existente por id.
        Usuario usuario = usuarioRepository.findById(id)

                // Si no existe, lanza error.
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Actualiza el nombre del usuario.
        usuario.setNombre(usuarioActualizado.getNombre());

        // Verifica si la nueva contraseña NO es null y NO está vacía.
        if (usuarioActualizado.getPassword() != null && !usuarioActualizado.getPassword().isEmpty()) {

            // Si es válida, actualiza la contraseña.
            usuario.setPassword(usuarioActualizado.getPassword());
        }

        // Actualiza el rol del usuario.
        usuario.setRol(usuarioActualizado.getRol());

        // Guarda los cambios en la base de datos (UPDATE).
        return usuarioRepository.save(usuario);
    }

    // =============================
    // ELIMINAR USUARIO
    // =============================

    public void eliminarUsuario(Long id) {

        // Elimina el usuario por su id.
        // Equivale a: DELETE FROM usuario WHERE id = ?;
        usuarioRepository.deleteById(id);
    }

    // =============================
    // LOGIN
    // =============================

    public Usuario login(String nombre, String password) {

        // Busca un usuario con ese nombre y contraseña.
        // Si existe → devuelve el usuario
        // Si no existe → devuelve null
        return usuarioRepository.findByNombreAndPassword(nombre, password).orElse(null);
    }
}
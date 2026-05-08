// Indica el paquete donde está ubicado este repositorio.
package com.prestafacil.backend.repository;

// Importa la entidad Usuario (tabla usuario en MySQL).
import com.prestafacil.backend.model.Usuario;

// Importa JpaRepository, que permite hacer operaciones CRUD automáticamente.
import org.springframework.data.jpa.repository.JpaRepository;

// Importa Optional, que se usa cuando un resultado puede existir o no.
import java.util.Optional;

// Repositorio que permite acceder a la tabla usuario en la base de datos.
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Método que busca un usuario por nombre y contraseña.
    // Devuelve un Optional porque el usuario puede existir o no.
    // Spring genera automáticamente esta consulta:
    // SELECT * FROM usuario WHERE nombre = ? AND password = ?
    Optional<Usuario> findByNombreAndPassword(String nombre, String password);
}
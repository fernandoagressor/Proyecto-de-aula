// Indica el paquete donde está ubicado el repositorio.
package com.prestafacil.backend.repository;

// Importa la entidad Cliente (tabla cliente en MySQL).
import com.prestafacil.backend.model.Cliente;

// Importa JpaRepository, que permite hacer operaciones CRUD automáticamente.
import org.springframework.data.jpa.repository.JpaRepository;

// Interfaz que actúa como repositorio para la entidad Cliente.
// Permite comunicarse con la base de datos sin escribir SQL manual.
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
}
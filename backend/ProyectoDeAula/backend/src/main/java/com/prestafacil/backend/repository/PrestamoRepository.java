// Indica el paquete donde está ubicado el repositorio.
package com.prestafacil.backend.repository;

// Importa el enum EstadoPrestamo.
import com.prestafacil.backend.model.EstadoPrestamo;

// Importa la entidad Prestamo.
import com.prestafacil.backend.model.Prestamo;

// Importa JpaRepository para tener CRUD automático.
import org.springframework.data.jpa.repository.JpaRepository;

// Importa List para devolver listas de préstamos.
import java.util.List;

// Repositorio encargado de comunicarse con la tabla prestamo.
public interface PrestamoRepository extends JpaRepository<Prestamo, Long> {

    // Busca todos los préstamos de un cliente específico.
    List<Prestamo> findByClienteId(Long clienteId);

    // Busca préstamos de un cliente ordenados desde el más reciente.
    List<Prestamo> findByClienteIdOrderByIdDesc(Long clienteId);

    // Busca todos los préstamos filtrando por estado.
    List<Prestamo> findByEstado(EstadoPrestamo estado);

    // Busca todos los préstamos filtrando por estado, ordenados desde el más reciente.
    List<Prestamo> findByEstadoOrderByIdDesc(EstadoPrestamo estado);

    // Busca préstamos de un cliente filtrando por varios estados.
    List<Prestamo> findByClienteIdAndEstadoIn(Long clienteId, List<EstadoPrestamo> estados);

    // Verifica si un cliente tiene algún préstamo en los estados indicados.
    boolean existsByClienteIdAndEstadoIn(Long clienteId, List<EstadoPrestamo> estados);

    // Cuenta préstamos por estado.
    long countByEstado(EstadoPrestamo estado);
}
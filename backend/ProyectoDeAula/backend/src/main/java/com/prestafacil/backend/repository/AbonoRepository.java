// Indica el paquete donde está ubicado el repositorio.
package com.prestafacil.backend.repository;

// Importa la entidad Abono.
import com.prestafacil.backend.model.Abono;

// Importa JpaRepository, que permite hacer operaciones CRUD automáticamente.
import org.springframework.data.jpa.repository.JpaRepository;

// Importa List para devolver listas de resultados.
import java.util.List;

// Interfaz que actúa como repositorio de la entidad Abono.
// Permite comunicarse con la base de datos sin escribir SQL manual.
public interface AbonoRepository extends JpaRepository<Abono, Long> {

    // Busca todos los abonos asociados a un préstamo específico.
    List<Abono> findByPrestamoId(Long prestamoId);

    // Busca todos los abonos de un préstamo ordenados desde el más reciente.
    List<Abono> findByPrestamoIdOrderByFechaDesc(Long prestamoId);

    // Busca abonos según su estado: PENDIENTE, APROBADO o RECHAZADO.
    List<Abono> findByEstado(String estado);

    List<Abono> findByEstadoAndPrestamoClienteIsNotNullOrderByFechaDesc(String estado);

    List<Abono> findByEstadoAndPrestamoClienteIsNullAndPrestamoEmpresaIdOrderByFechaDesc(
            String estado,
            Long empresaId
    );

    // Busca abonos por estado ordenados desde el más reciente.
    List<Abono> findByEstadoOrderByFechaDesc(String estado);

    // Busca abonos de un préstamo según estado.
    List<Abono> findByPrestamoIdAndEstado(Long prestamoId, String estado);

    // Verifica si un préstamo tiene abonos pendientes.
    boolean existsByPrestamoIdAndEstado(Long prestamoId, String estado);

    // Cuenta cuántos abonos existen con un estado específico.
    long countByEstado(String estado);
}
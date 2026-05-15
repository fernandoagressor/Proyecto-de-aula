// Indica el paquete donde está ubicado el servicio.
package com.prestafacil.backend.service;

// Importa la entidad Cliente (tabla cliente en MySQL).
import com.prestafacil.backend.model.Cliente;

// Importa la entidad Usuario (tabla usuario en MySQL).
import com.prestafacil.backend.model.Usuario;

// Importa el repositorio de clientes.
import com.prestafacil.backend.repository.ClienteRepository;

// Importa el repositorio de usuarios.
import com.prestafacil.backend.repository.UsuarioRepository;

// Indica que esta clase es un servicio de Spring.
import org.springframework.stereotype.Service;

// Importa List para manejar listas.
import java.util.List;

// Marca esta clase como servicio (lógica del negocio).
@Service
public class ClienteService {

    // Repositorio que permite trabajar con la tabla cliente.
    private final ClienteRepository clienteRepository;

    // Repositorio que permite trabajar con la tabla usuario.
    private final UsuarioRepository usuarioRepository;

    // Constructor donde Spring inyecta automáticamente los repositorios.
    public ClienteService(ClienteRepository clienteRepository, UsuarioRepository usuarioRepository) {

        // Guarda el repositorio de clientes.
        this.clienteRepository = clienteRepository;

        // Guarda el repositorio de usuarios.
        this.usuarioRepository = usuarioRepository;
    }

    // =============================
    // LISTAR CLIENTES
    // =============================

    // Devuelve todos los clientes.
    public List<Cliente> listarClientes() {

        // Llama al repositorio → SELECT * FROM cliente
        return clienteRepository.findAll();
    }
    public List<Cliente> listarClientesPorEmpresa(Long empresaId) {

        if (empresaId == null) {
            throw new IllegalArgumentException("El id de la empresa es obligatorio.");
        }

        return clienteRepository.findByEmpresaId(empresaId);
    }

    // =============================
    // OBTENER CLIENTE POR ID
    // =============================

    public Cliente obtenerClientePorId(Long id) {

        // Busca cliente por id.
        return clienteRepository.findById(id)

                // Si no existe, lanza error.
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
    }

    // =============================
    // CREAR CLIENTE
    // =============================

    public Cliente crearCliente(Cliente cliente) {

        // 1. Guarda el cliente en MySQL.
        // Internamente ejecuta un INSERT.

        Cliente clienteGuardado = clienteRepository.save(cliente);

        // 2. Crea un usuario automáticamente para ese cliente.
        Usuario usuario = new Usuario();

        // El nombre del usuario será la cédula.
        usuario.setNombre(clienteGuardado.getCedula());

        // La contraseña también será la cédula.
        usuario.setPassword(clienteGuardado.getCedula());

        // Asigna el rol "cliente".
        usuario.setRol("cliente");

        // Relaciona el usuario con el cliente.
        usuario.setClienteId(clienteGuardado.getId());


        // Guarda el usuario en la tabla usuario.
        usuarioRepository.save(usuario);

        // Devuelve el cliente guardado.
        return clienteGuardado;
    }

    // =============================
    // ACTUALIZAR CLIENTE
    // =============================

    public Cliente actualizarCliente(Long id, Cliente clienteActualizado) {

        // Busca el cliente existente.
        Cliente cliente = clienteRepository.findById(id)

                // Si no existe, lanza error.
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        // Actualiza los datos del cliente.
        cliente.setNombre(clienteActualizado.getNombre());
        cliente.setCedula(clienteActualizado.getCedula());
        cliente.setTelefono(clienteActualizado.getTelefono());
        cliente.setDireccion(clienteActualizado.getDireccion());

        // Guarda los cambios en MySQL (UPDATE).
        Cliente clienteGuardado = clienteRepository.save(cliente);

        // =============================
        // ACTUALIZAR USUARIO ASOCIADO
        // =============================

        // Trae todos los usuarios.
        List<Usuario> usuarios = usuarioRepository.findAll();

        // Recorre todos los usuarios.
        for (Usuario usuario : usuarios) {

            // Verifica si el usuario pertenece a este cliente.
            if (usuario.getClienteId() != null && usuario.getClienteId().equals(clienteGuardado.getId())) {

                // Actualiza el nombre del usuario con la nueva cédula.
                usuario.setNombre(clienteGuardado.getCedula());

                // Guarda el usuario actualizado.
                usuarioRepository.save(usuario);

                // Sale del ciclo porque ya encontró el usuario.
                break;
            }
        }

        // Devuelve el cliente actualizado.
        return clienteGuardado;
    }

    // =============================
    // ELIMINAR CLIENTE
    // =============================

    public void eliminarCliente(Long id) {

        // Primero elimina el usuario asociado.
        List<Usuario> usuarios = usuarioRepository.findAll();

        // Recorre los usuarios.
        for (Usuario usuario : usuarios) {

            // Si el usuario pertenece al cliente:
            if (usuario.getClienteId() != null && usuario.getClienteId().equals(id)) {

                // Elimina el usuario.
                usuarioRepository.delete(usuario);

                // Sale del ciclo.
                break;
            }
        }

        // Luego elimina el cliente.
        clienteRepository.deleteById(id);
    }
}
package com.prestafacil.backend.controller;// Importa la clase Cliente, que representa la tabla cliente en MySQL.
import com.prestafacil.backend.model.Cliente;

// Importa el servicio ClienteService, donde está la lógica del negocio.
import com.prestafacil.backend.service.ClienteService;

// Importa las anotaciones de Spring para crear rutas REST (GET, POST, etc).
import org.springframework.web.bind.annotation.*;

// Importa List para poder manejar listas de clientes.
import java.util.List;

// Indica que esta clase es un controlador REST.
// Un controlador REST recibe peticiones HTTP y devuelve datos (normalmente JSON).
@RestController

// Define la ruta base para este controlador.
// Todas las peticiones empiezan con /api/clientes.
@RequestMapping("/api/clientes")

// Permite que Angular (puerto 4200) pueda conectarse al backend (puerto 8080).
@CrossOrigin(origins = "http://localhost:4200")

// Clase que controla todo lo relacionado con clientes.
public class ClienteController {

    // Variable que guarda el servicio de clientes.
    // final significa que solo se asigna una vez.
    private final ClienteService clienteService;

    // Constructor del controlador.
    // Spring Boot inyecta automáticamente el ClienteService aquí.
    public ClienteController(ClienteService clienteService) {

        // Guarda el servicio en la variable de la clase.
        this.clienteService = clienteService;
    }

    // Método que atiende peticiones GET a:
    // http://localhost:8080/api/clientes
    @GetMapping

    // Devuelve una lista con todos los clientes.
    public List<Cliente> listarClientes() {

        // Llama al servicio para obtener todos los clientes desde MySQL.
        return clienteService.listarClientes();
    }
    @GetMapping("/empresa/{empresaId}")
    public List<Cliente> listarClientesPorEmpresa(@PathVariable Long empresaId) {

        return clienteService.listarClientesPorEmpresa(empresaId);
    }

    // Método que atiende GET a:
    // http://localhost:8080/api/clientes/{id}
    // Ejemplo:
    // http://localhost:8080/api/clientes/5
    @GetMapping("/{id}")

    // Devuelve un cliente específico según su id.
    public Cliente obtenerClientePorId(@PathVariable Long id) {

        // @PathVariable captura el id que viene en la URL.
        // Luego se envía al servicio para buscar ese cliente.
        return clienteService.obtenerClientePorId(id);
    }

    // Método que atiende POST a:
    // http://localhost:8080/api/clientes
    @PostMapping

    // Crea un nuevo cliente.
    public Cliente crearCliente(@RequestBody Cliente cliente) {

        // @RequestBody convierte el JSON que envía Angular en un objeto Cliente.
        // Luego se manda al servicio para guardarlo en MySQL.
        return clienteService.crearCliente(cliente);
    }

    // Método que atiende PUT a:
    // http://localhost:8080/api/clientes/{id}
    @PutMapping("/{id}")

    // Actualiza un cliente existente.
    public Cliente actualizarCliente(@PathVariable Long id, @RequestBody Cliente cliente) {

        // @PathVariable obtiene el id desde la URL.
        // @RequestBody obtiene los datos nuevos desde Angular.
        // Se manda al servicio para actualizar en MySQL.
        return clienteService.actualizarCliente(id, cliente);
    }

    // Método que atiende DELETE a:
    // http://localhost:8080/api/clientes/{id}
    @DeleteMapping("/{id}")

    // Elimina un cliente por su id.
    public void eliminarCliente(@PathVariable Long id) {

        // Llama al servicio para eliminar el cliente en la base de datos.
        clienteService.eliminarCliente(id);
    }
}
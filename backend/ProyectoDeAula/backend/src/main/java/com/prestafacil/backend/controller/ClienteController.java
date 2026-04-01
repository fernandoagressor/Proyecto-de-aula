package com.prestafacil.backend.controller;

import com.prestafacil.backend.model.Cliente;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = "httop://localhost:4200")
public class ClienteController {
    private List<Cliente> clientes =  new ArrayList<>();

    public  ClienteController() {
        clientes.add(new Cliente(1L, "Juan Perez", "123456", "3001112233", "Cartagena"));
        clientes.add(new Cliente(2L, "Maaria Lopez", "654321", "3012223344", "Cartagena"));

    }
    @GetMapping
    public List<Cliente> listarClientes(){
        return clientes;
    }
    @PostMapping
    public Cliente criarCliente(@RequestBody Cliente cliente){
        cliente.setId((long)(clientes.size() + 1));
        clientes.add(cliente);
        return cliente;
    }
    @DeleteMapping("/{id}")
    public void eliminarCliente(@PathVariable Long id){
        clientes.removeIf(c -> c.getId().equals(id));
    }
    @PutMapping("/{id}")
    public Cliente atualizarCliente(@PathVariable Long id, @RequestBody Cliente clienteAtualizado){
        for(Cliente c : clientes){
            if(c.getId().equals(id)){
                c.setNombre(clienteAtualizado.getNombre());
                c.setCedula( clienteAtualizado.getCedula());
                c.setTelefono( clienteAtualizado.getTelefono());
                c.setDireccion(clienteAtualizado.getDireccion());
                return c;
            }
        }
        return null;
    }
}

package com.prestafacil.backend.service;

import com.prestafacil.backend.model.Cliente;
import com.prestafacil.backend.model.Usuario;
import com.prestafacil.backend.repository.ClienteRepository;
import com.prestafacil.backend.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;

    public ClienteService(ClienteRepository clienteRepository, UsuarioRepository usuarioRepository) {
        this.clienteRepository = clienteRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<Cliente> listarClientes() {
        return clienteRepository.findAll();
    }

    public Cliente obtenerClientePorId(Long id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
    }

    public Cliente crearCliente(Cliente cliente) {
        // 1. Guardar cliente
        Cliente clienteGuardado = clienteRepository.save(cliente);

        // 2. Crear usuario automático para ese cliente
        Usuario usuario = new Usuario();
        usuario.setNombre(clienteGuardado.getCedula());
        usuario.setPassword(clienteGuardado.getCedula());
        usuario.setRol("cliente");
        usuario.setClienteId(clienteGuardado.getId());

        usuarioRepository.save(usuario);

        return clienteGuardado;
    }

    public Cliente actualizarCliente(Long id, Cliente clienteActualizado) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        cliente.setNombre(clienteActualizado.getNombre());
        cliente.setCedula(clienteActualizado.getCedula());
        cliente.setTelefono(clienteActualizado.getTelefono());
        cliente.setDireccion(clienteActualizado.getDireccion());

        Cliente clienteGuardado = clienteRepository.save(cliente);

        // Actualizar también el usuario asociado, si existe
        List<Usuario> usuarios = usuarioRepository.findAll();
        for (Usuario usuario : usuarios) {
            if (usuario.getClienteId() != null && usuario.getClienteId().equals(clienteGuardado.getId())) {
                usuario.setNombre(clienteGuardado.getCedula());
                usuarioRepository.save(usuario);
                break;
            }
        }

        return clienteGuardado;
    }

    public void eliminarCliente(Long id) {
        // Eliminar primero el usuario asociado
        List<Usuario> usuarios = usuarioRepository.findAll();
        for (Usuario usuario : usuarios) {
            if (usuario.getClienteId() != null && usuario.getClienteId().equals(id)) {
                usuarioRepository.delete(usuario);
                break;
            }
        }

        clienteRepository.deleteById(id);
    }
}
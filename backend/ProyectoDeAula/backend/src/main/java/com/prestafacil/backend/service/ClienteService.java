package com.prestafacil.backend.service;

import com.prestafacil.backend.model.Abono;
import com.prestafacil.backend.model.Cliente;
import com.prestafacil.backend.model.Prestamo;
import com.prestafacil.backend.model.Usuario;
import com.prestafacil.backend.repository.AbonoRepository;
import com.prestafacil.backend.repository.ClienteRepository;
import com.prestafacil.backend.repository.PrestamoRepository;
import com.prestafacil.backend.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;
    private final PrestamoRepository prestamoRepository;
    private final AbonoRepository abonoRepository;

    public ClienteService(ClienteRepository clienteRepository,
                          UsuarioRepository usuarioRepository,
                          PrestamoRepository prestamoRepository,
                          AbonoRepository abonoRepository) {
        this.clienteRepository = clienteRepository;
        this.usuarioRepository = usuarioRepository;
        this.prestamoRepository = prestamoRepository;
        this.abonoRepository = abonoRepository;
    }

    public List<Cliente> listarClientes() {
        return clienteRepository.findAll();
    }

    public Cliente obtenerPorId(Long id) {
        return clienteRepository.findById(id).orElse(null);
    }

    public Cliente crearCliente(Cliente cliente) {
        Cliente clienteGuardado = clienteRepository.save(cliente);

        Usuario usuario = new Usuario();
        usuario.setNombre(clienteGuardado.getCedula());
        usuario.setPassword(clienteGuardado.getCedula());
        usuario.setRol("cliente");
        usuario.setClienteId(clienteGuardado.getId());

        usuarioRepository.save(usuario);

        return clienteGuardado;
    }

    public Cliente actualizarCliente(Long id, Cliente clienteActualizado) {
        Optional<Cliente> clienteOptional = clienteRepository.findById(id);

        if (clienteOptional.isPresent()) {
            Cliente cliente = clienteOptional.get();
            cliente.setNombre(clienteActualizado.getNombre());
            cliente.setCedula(clienteActualizado.getCedula());
            cliente.setTelefono(clienteActualizado.getTelefono());
            cliente.setDireccion(clienteActualizado.getDireccion());
            return clienteRepository.save(cliente);
        }

        return null;
    }

    public void eliminarCliente(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        List<Prestamo> prestamos = prestamoRepository.findByClienteId(id);

        for (Prestamo prestamo : prestamos) {
            if (prestamo.getSaldoPendiente() > 0) {
                throw new RuntimeException("No se puede eliminar el cliente porque aún tiene deuda pendiente");
            }
        }

        for (Prestamo prestamo : prestamos) {
            List<Abono> abonos = abonoRepository.findByPrestamoId(prestamo.getId());
            abonoRepository.deleteAll(abonos);
        }

        prestamoRepository.deleteAll(prestamos);

        Usuario usuario = usuarioRepository.findByClienteId(id);
        if (usuario != null) {
            usuarioRepository.delete(usuario);
        }

        clienteRepository.delete(cliente);
    }
}
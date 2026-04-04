package com.prestafacil.backend.service;

import com.prestafacil.backend.model.Usuario;
import com.prestafacil.backend.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    public Usuario crearUsuario(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    public Usuario login(String nombre, String password) {
        Optional<Usuario> usuario = usuarioRepository.findByNombreAndPassword(nombre, password);
        return usuario.orElse(null);
    }
    public Usuario obtenerPorId(Long id) {
        return usuarioRepository.findById(id).orElse(null);
    }

    public Usuario actualizarUsuario(Long id, Usuario usuarioActualizado) {
        Optional<Usuario> usuarioOptional = usuarioRepository.findById(id);

        if (usuarioOptional.isPresent()) {
            Usuario usuario = usuarioOptional.get();
            usuario.setNombre(usuarioActualizado.getNombre());
            usuario.setPassword(usuarioActualizado.getPassword());
            usuario.setRol(usuarioActualizado.getRol());
            return usuarioRepository.save(usuario);
        }

        return null;
    }

    public void eliminarUsuario(Long id) {
        usuarioRepository.deleteById(id);
    }
}